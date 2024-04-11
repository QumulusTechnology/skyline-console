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

import React from 'react';
import { inject, observer } from 'mobx-react';
import globalPoolStore from 'src/stores/octavia/pool';
import { provisioningStatusCodes } from 'resources/octavia/lb';
import Base from 'containers/TabDetail';
import HealthMonitor from './HealthMonitor';
import Member from './Member';
import { actionConfigs } from '../Actions';

export class PoolDetail extends Base {
  get name() {
    return t('pool');
  }

  get policy() {
    return 'os_load-balancer_api:pool:get_one';
  }

  get listUrl() {
    const { loadBalancerId: id } = this.params;
    return this.getRoutePath('lbDetail', { id });
  }

  get actionConfigs() {
    return actionConfigs;
  }

  get detailInfos() {
    return [
      {
        title: t('Pool Name'),
        dataIndex: 'name',
      },
      {
        title: t('Protocol Type'),
        dataIndex: 'protocol',
      },
      {
        title: t('LB Algorithm'),
        dataIndex: 'lb_algorithm',
      },
      {
        title: t('Status'),
        dataIndex: 'provisioning_status',
        valueMap: provisioningStatusCodes,
      },
      {
        title: t('Session Persistence'),
        dataIndex: 'session_persistence',
        render: (value) => (
          <>
            <div>
              <label for="type">{ t('Type:') }</label>&nbsp;
              <span>{ value?.type }</span>
            </div>
            <div>
              <label for="cookie_name">{ t('Cookie Name:') }</label>&nbsp;
              <span>{ value?.cookie_name || t('N/A') }</span>
            </div>
            <div>
              <label for="persistence_timeout">{ t('Persistence Timeout:') }</label>&nbsp;
              <span>{ value?.persistence_timeout || t('N/A') }</span>
            </div>
            <div>
              <label for="persistence_granularity">{ t('Persistence Granularity:') }</label>&nbsp;
              <span>{ value?.persistence_granularity || t('N/A') }</span>
            </div>
          </>
        )
      },
      {
        title: t('Admin State Up'),
        dataIndex: 'admin_state_up',
        render: (value) => (value ? t('On') : t('Off')),
      },
      {
        title: t('TLS Enabled'),
        dataIndex: 'tls_enabled',
        render: (value) => (value ? t('Enabled') : t('Disabled'))
      },
      {
        title: t('TLS Ciphers'),
        dataIndex: 'tls_ciphers'
      },
      {
        title: t('Description'),
        dataIndex: 'description',
      },
    ];
  }

  get forceLoadingTabs() {
    return ['detail'];
  }

  get tabs() {
    const tabs = [
      {
        title: t('Health Monitor'),
        key: 'health-monitor',
        component: HealthMonitor,
      },
      {
        title: t('Members'),
        key: 'member',
        component: Member
      }
    ];
    return tabs;
  }

  init() {
    this.store = globalPoolStore;
  }
}

export default inject('rootStore')(observer(PoolDetail));
