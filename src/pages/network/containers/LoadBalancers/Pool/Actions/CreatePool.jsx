// Copyright 2021 99cloud
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { isNumber } from 'lodash';
import { inject, observer } from 'mobx-react';
import { StepAction } from 'containers/Action';
import globalPoolStore from 'stores/octavia/pool';
import healthMonitorStore from 'stores/octavia/health-monitor'
import { LbaasStore } from 'stores/octavia/loadbalancer';
import PoolStep from '../../StepCreateComponents/PoolStep';
import HealthMonitorStep from '../../StepCreateComponents/HealthMonitorStep';
import MemberStep from '../../StepCreateComponents/MemberStep';

export class CreatePool extends StepAction {
  static title = t('Create Pool');

  static path = (_, containerProps) => {
    const { detail: { id = null } } = containerProps

    return `/network/load-balancers/${id}/create-pool`
  };

  get isLoading() {
    return this.lbStore.isLoading;
  }

  async init() {
    this.store = globalPoolStore;
    this.hmStore = healthMonitorStore;
    this.lbStore = new LbaasStore();

    const { params: { id = null } } = this.match;

    try {
      if (this.lbStore.fetchDetailWithFip) {
        const newParams = {
          id,
          silent: true,
          all_projects: this.isAdminPage,
        };
        await this.lbStore.fetchDetailWithFip(newParams).catch(this.catch);
      }
    } catch(e) {
      this.setState({
        notFound: true
      });
    }
  }

  static policy = 'os_load-balancer_api:pool:post';

  static allowed(_, containerProps) {
    const { isAdminPage = false } = containerProps;
    return Promise.resolve(!isAdminPage);
  }

  get name() {
    return t('Create Pool');
  }

  get listUrl() {
    const { params: {id = null} } = this.props.match;

    return `${this.getRoutePath('lb')}/detail/${id}?tab=pool`;
  }

  get hasConfirmStep() {
    return false;
  }

  get endpointError() {
    const { notFound = null } = this.state;

    return notFound;
  }

  get steps() {
    return [
      {
        title: t('Pool'),
        component: PoolStep,
      },
      {
        title: t('Member Detail'),
        component: MemberStep,
      },
      {
        title: t('Health Monitor Detail'),
        component: HealthMonitorStep,
      },
    ];
  }

  onSubmit = async (values) => {
    const {
      enableHealthMonitor,
      pool_admin_state_up,
      monitor_admin_state_up,
      insert_headers,
      ...rest
    } = values;
    const { params: { id } } = this.match;
    
    const poolData = { loadbalancer_id: id, admin_state_up: pool_admin_state_up };
    const healthMonitorData = { admin_state_up: monitor_admin_state_up };
    Object.keys(rest).forEach((i) => {
      if (i.indexOf('pool') === 0) {
        poolData[i.replace('pool_', '')] = values[i] || null; 
      } else if (i.indexOf('health') === 0) {
        if(i.includes('expected_codes')) {
          healthMonitorData[i.replace('health_', '')] = `${values[i]}`;
        } else {
          healthMonitorData[i.replace('health_', '')] = values[i];
        }
      }
    });

    // conditional session persistence
    if (rest.psp_type) {
      const {
        psp_type,
        psp_cookie_name,
        psp_persistence_timeout,
        psp_persistence_granularity,
      } = rest;

      poolData.session_persistence = { type: psp_type };

      if (psp_cookie_name) {
        poolData.session_persistence.cookie_name = psp_cookie_name;
      }
      if (isNumber(psp_persistence_timeout)) {
        poolData.session_persistence.persistence_timeout =
          psp_persistence_timeout;
      }
      if (psp_persistence_granularity) {
        poolData.session_persistence.persistence_granularity =
          psp_persistence_granularity;
      }
    }

    // conditional http_method, url_path and expected_codes
    if(!(healthMonitorData.type === 'HTTP' || healthMonitorData.tye === 'HTTPS')) {
      delete healthMonitorData.expected_codes;
      delete healthMonitorData.url_path;
      delete healthMonitorData.http_method;
    }

    // Extra Members
    const {
      extMembers = [],
      Member: {
        selectedRowKeys: keys = [],
        selectedRows,
        memberUpdateValue = [],
      } = {},
    } = rest;
    const memberData = [];
    keys.forEach((id) => {
      const selectedMember = selectedRows.filter((it) => it.id === id)[0];
      const inputData = memberUpdateValue.filter((it) => it.id === id)[0];
      const { weight = 0, protocol_port = 1 } = inputData || {};
      const { member_ip, fixed_ips = [] } = selectedMember;
      member_ip.forEach((address) => {
        const { subnet_id = undefined } = fixed_ips.filter(
          (it) => it.ip_address === address
        )[0];
        const addMember = {
          weight,
          protocol_port,
          address, 
          subnet_id,
        };
        memberData.push(addMember);
      });
    });

    extMembers.forEach((member) => {
      const {
        ip,
        protocol_port,
        weight,
        name: server_name = null,
        subnet_id,
      } = member.ip_address;
      const addMember = {
        weight,
        protocol_port,
        address: ip,
        name: server_name,
        subnet_id,
      };
      memberData.push(addMember);
    });

    poolData.members = memberData;

    // create pool
    if (enableHealthMonitor) {
      const result = await this.store.create(poolData);
 
      if(result?.pool?.id) {
        healthMonitorData.pool_id = result.pool.id;

        const poolDetail = setInterval(async () => {
          const poolDetailResult = await this.store.pureFetchDetail({id: result.pool.id});

          if(poolDetailResult?.provisioning_status === "ACTIVE") {
            clearInterval(poolDetail)
            // eslint-disable-next-line no-return-await
            return await this.hmStore.create(healthMonitorData);
          }
        }, 5000);

      }
    } else {
      return this.store.create(poolData);
    }

  };
}

export default inject('rootStore')(observer(CreatePool));
