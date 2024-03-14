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

import { inject, observer } from 'mobx-react';
import Base from 'components/Form';
import { Algorithm, algorithmTip } from 'resources/octavia/pool';
import { poolProtocols, sessionPersitence } from 'resources/octavia/lb';

export class PoolStep extends Base {
  get title() {
    return 'Pool Detail';
  }

  get name() {
    return 'Pool Detail';
  }

  get isStep() {
    return true;
  }

  get filterOptions() {
    const { context: { listener_protocol = '' } = {} } = this.props;
    return poolProtocols.filter(
      (it) => it.listener[listener_protocol.toLowerCase()] === 'valid'
    );
  }

  allowed = () => Promise.resolve();

  init() {
    const {
      context: { psp_type = null, pool_tls_enabled = false },
    } = this.props;

    this.state = {
      pool_lb_algorithm: undefined,
      psp_type,
      pool_tls_enabled,
    };
  }

  handleAlgorithmChange = (e) => {
    this.setState({
      pool_lb_algorithm: e,
    });
  };

  onChangeTLSEnable = (e) => {
    this.setState({
      pool_tls_enabled: e,
    });
  };

  onChangePSPType = (e) => {
    this.setState({
      psp_type: e,
    });
  };

  get defaultValue() {
    return {
      pool_admin_state_up: true,
      pool_tls_enabled: false,
    };
  }

  get formItems() {
    const { pool_lb_algorithm, pool_tls_enabled, psp_type } = this.state;

    console.log({ state: this.state, props: this.props });

    return [
      {
        name: 'pool_name',
        label: t('Pool Name'),
        type: 'input-name',
        required: true,
      },
      {
        name: 'pool_description',
        label: t('Pool Description'),
        type: 'textarea',
      },
      {
        name: 'pool_lb_algorithm',
        label: t('Pool Algorithm'),
        type: 'select',
        options: Algorithm,
        onChange: this.handleAlgorithmChange,
        extra: pool_lb_algorithm && algorithmTip[pool_lb_algorithm],
        required: true,
      },
      {
        name: 'pool_protocol',
        label: t('Pool Protocol'),
        type: 'select',
        options: this.filterOptions,
        onChange: () => {
          this.updateContext({
            health_type: '',
          });
        },
        required: true,
      },
      {
        type: 'divider',
      },
      {
        name: 'psp_type',
        label: t('Session Persistence'),
        type: 'select',
        options: sessionPersitence,
        onChange: this.onChangePSPType,
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
        hidden: !psp_type,
      },
      {
        name: 'psp_persistence_granularity',
        label: t('Peristence Granularity'),
        type: 'textarea',
        hidden: !psp_type,
      },
      {
        type: 'divider',
      },
      {
        name: 'pool_tls_enabled',
        label: t('TLS Enabled'),
        type: 'switch',
        tip: t('Backend server members will use TLS encryption when enabled.'),
        onChange: this.onChangeTLSEnable,
      },
      {
        name: 'pool_tls_ciphers',
        label: t('TLS Cipher String'),
        type: 'textarea',
        hidden: !pool_tls_enabled,
        required: pool_tls_enabled,
      },
      {
        name: 'pool_admin_state_up',
        label: t('Admin State Up'),
        type: 'switch',
        tip: t('Defines the admin state of the pool.'),
      },
    ];
  }
}

export default inject('rootStore')(observer(PoolStep));
