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
import { ModalAction } from 'containers/Action';
import globalPoolStore from 'stores/octavia/pool';
import { Algorithm } from 'resources/octavia/pool';
import { poolProtocols, sessionPersitence } from 'resources/octavia/lb';

export class EditPoolInfo extends ModalAction {
  async init() {
    this.state.pool = {};
    this.store = globalPoolStore;
    await this.getPoolDetail();

    const { session_persistence, tls_enabled } = this.item;

    if(session_persistence || tls_enabled) {
      this.setState({
        psp_type: session_persistence?.type || undefined,
        tls_enabled
      })
    }
  }

  static id = 'pool-edit';

  static title = t('Edit Pool');

  static buttonText = t('Edit');

  get name() {
    return t('edit pool');
  }

  get labelCol() {
    return {
      xs: { span: 8 },
      sm: { span: 8 },
    };
  }

  get isSubmitting() {
    return this.store.isSubmitting;
  }

  get defaultValue() {
    const {  id, name, description, protocol, lb_algorithm, admin_state_up, session_persistence, tls_enabled, tls_ciphers } = this.item;


    return {
      id,
      name,
      description,
      protocol,
      lb_algorithm,
      admin_state_up,
      tls_enabled,
      tls_ciphers,
      psp_type: session_persistence?.type || undefined,
      psp_cookie_name: session_persistence?.cookie_name || undefined,
      psp_persistence_timeout: session_persistence?.persistence_timeout || undefined,
      psp_persistence_granularity: session_persistence?.persistence_granularity || undefined
    };
  }

  static policy = 'os_load-balancer_api:pool:put';

  static allowed = () => true;

  async getPoolDetail() {
    this.setState({ pool: this.item }, () => {
      this.updateDefaultValue();
    });
  }

  onChangeSessionPersistence = (e) => {
    this.setState({
      psp_type: e
    })
  }

  onChangeTLSEnabled = (e) => {
    this.setState({
      tls_enabled: e
    })
  }

  get formItems() {

    const { psp_type, tls_enabled } = this.state;
    const { protocol } = this.item;

    return [
      {
        name: 'name',
        label: t('Name'),
        type: 'input-name',
        required: true,
      },
      {
        name: 'description',
        label: t('Description'),
        type: 'textarea',
        maxLength: 255,
      },
      {
        name: 'lb_algorithm',
        label: t('LB Algorithm'),
        type: 'select',
        options: Algorithm,
        required: true,
      },
      {
        name: 'protocol',
        label: t('Protocol'),
        type: 'select',
        options: poolProtocols,
        required: true,
        disabled: true,
      },
      {
        type: 'divider'
      },
      {
        name: 'psp_type',
        label: t('Session Persistence'),
        type: 'select',
        options: sessionPersitence,
        onChange: this.onChangeSessionPersistence
      },
      {
        name: 'psp_cookie_name',
        label: t('Cookie Name'),
        type: 'input-name',
        hidden: !psp_type || !(psp_type === 'APP_COOKIE'),
        required: true,
      },
      {
        name: 'psp_persistence_timeout',
        label: t('Persistence Timeout'),
        type: 'input-number',
        hidden: !psp_type || protocol !== 'UDP',
      },
      {
        name: 'psp_persistence_granularity',
        label: t('Peristence Granularity'),
        type: 'textarea',
        hidden: !psp_type || protocol !== 'UDP',
      },
      {
        type: 'divider'
      },
      {
        name: 'tls_enabled',
        label: t('TLS Enabled'),
        type: 'switch',
        tip: t('Backend server members will use TLS encryption when enabled.'),
        onChange: this.onChangeTLSEnabled
      },
      {
        name: 'tls_ciphers',
        label: t('TLS Cipher String'),
        type: 'textarea',
        hidden: !tls_enabled
      },
      {
        name: 'admin_state_up',
        label: t('Admin State Up'),
        type: 'switch',
        tip: t('Defines the admin state of the pool.'),
      },
    ];
  }

  onSubmit = (values) => {
    const { id } = this.item;
    const { protocol, psp_type, psp_cookie_name, psp_persistence_timeout, psp_persistence_granularity, tls_enabled, tls_ciphers, ...others } = values;

    const data = { ...others, tls_enabled, tls_ciphers };

    if (psp_type) {
      data.session_persistence = { type: psp_type };

      if (psp_cookie_name && psp_type === 'APP_COOKIE') {
        data.session_persistence.cookie_name = psp_cookie_name;
      }
      if (isNumber(psp_persistence_timeout) && protocol === 'UDP') {
        data.session_persistence.persistence_timeout =
          psp_persistence_timeout;
      }
      if (psp_persistence_granularity && protocol === 'UDP') {
        data.session_persistence.persistence_granularity =
          psp_persistence_granularity;
      }
    } else {
      data.session_persistence = null;
    }

    if(!tls_enabled) {
      data.tls_ciphers = "";
    } else if(tls_enabled && !tls_ciphers) {
      data.tls_ciphers = null;
    }

    return this.store.edit({ id }, data);
  };
}

export default inject('rootStore')(observer(EditPoolInfo));
