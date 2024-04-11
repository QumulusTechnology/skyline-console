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
import { ModalAction } from 'containers/Action';
import healthMonitorStore from 'stores/octavia/health-monitor';
import { httpMethods, healthProtocols } from 'resources/octavia/lb';

export class CreateHealthMonitor extends ModalAction {
  async init() {
    this.store = healthMonitorStore;
  }

  static id = 'health-monitor-create';

  static title = t('Create Health Monitor');

  static buttonText = t('Create Health Monitor');

  static get modalSize() {
    return 'large';
  }

  getModalSize() {
    return 'large';
  }

  get name() {
    return t('Create health monitor`');
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
    return {
      type: '',
      delay: 5,
      timeout: 3,
      max_retries: 3,
      admin_state_up: true,
    }
  }

  get filteredProtocolOptions() {
    const { protocol } = this.item;

    return healthProtocols.filter(
      (it) => it.pool[protocol.toLowerCase()] === 'valid'
    );
  }

  get showHTTPFields() {
    const { health_type } = this.state;
    return health_type === 'HTTP' || health_type === 'HTTPS'
  }

  static policy = 'os_load-balancer_api:healthmonitor:post';

  static allowed = (item) => {
    const { healthmonitor_id } = item;
    return Promise.resolve(!healthmonitor_id);
  };

  onChangeProtocol = (health_type) => {
    this.setState({
      health_type
    });
  }

  validateExpectedCodes = (rule, value) => {
    const validateHasComma = new RegExp(/^([^,]*),/);
    const validateHasDash = new RegExp(/-/);
    const hasOneDash = new RegExp(/^[^-]*-[^-]*$/);
    const hasNoSpace = new RegExp(/^\S*$/);
    const hasLetter = new RegExp(/.*[a-zA-Z].*/);
    const errorMsg = t('The expected status code is not valid.');

    return new Promise((resolve, reject) => {
      if(!hasLetter.test(value)) {
        if(validateHasComma.test(value)) {
          if(validateHasDash.test(value) || !hasNoSpace.test(value)) reject(errorMsg);
        } else if(validateHasDash.test(value)) {
          if(validateHasComma.test(value) || !hasNoSpace.test(value) || !hasOneDash.test(value)) reject(errorMsg);
        } else {
          if(!hasNoSpace.test(value)) reject(errorMsg);
        }
      } else reject(errorMsg);
      resolve();
    });
  };

  get formItems() {

    const renderDivider = this.showHTTPFields ? {
      type: 'divider'
    } : {};

    return [
      {
        name: 'name',
        label: t('Health Monitor Name'),
        type: 'input-name',
        required: true,
      },
      {
        name: 'type',
        label: t('Health Monitor Type'),
        type: 'select',
        options: this.filteredProtocolOptions,
        required: true,
        onChange: this.onChangeProtocol
      },
      {
        name: 'delay',
        label: t('Health Monitor Delay'),
        type: 'input-number',
        min: 0,
        extra: t('Maximum interval time for each health check response'),
        required: true,
      },
      {
        name: 'max_retries',
        label: t('Health Monitor Max Retries'),
        type: 'input-number',
        min: 1,
        max: 10,
        extra: t(
          'That is, after how many consecutive failures of the health check, the health check status of the back-end cloud server is changed from normal to abnormal'
        ),
        required: true,
      },
      {
        name: 'timeout',
        label: t('Health Monitor Timeout'),
        type: 'input-number',
        min: 0,
        extra: t(
          'The timeout period of waiting for the return of the health check request, the check timeout will be judged as a check failure'
        ),
        required: true,
      },
      {
        name: 'admin_state_up',
        label: t('Admin State Up'),
        type: 'switch',
        tip: t('Defines the admin state of the health monitor.'),
      },
      renderDivider,
      {
        name: 'http_method',
        label: t('HTTP Method'),
        type: 'select',
        options: httpMethods,
        hidden: !this.showHTTPFields,
        required: this.showHTTPFields
      },
      {
        name: 'expected_codes',
        label: t('Expected Codes'),
        type: 'input',
        hidden: !this.showHTTPFields,
        required: this.showHTTPFields,
        validator: this.validateExpectedCodes,
        placeholder: '200 or 200-300 or 200,300'
      },
      {
        name: 'url_path',
        label: t('URL Path'),
        type: 'input',
        hidden: !this.showHTTPFields,
        required: this.showHTTPFields,
        placeholder: "/"
      },
    ];
  }

  onSubmit = (values) => {
    const { id } = this.item;

    if(!(values.type === 'HTTP' || values.type === 'HTTPS')) {
      delete values.expected_codes;
      delete values.url_path;
      delete values.http_method;
    } else {
      values.expected_codes = `${values.expected_codes}`;
    }


    return this.store.create({pool_id: id, ...values});
  };
}

export default inject('rootStore')(observer(CreateHealthMonitor));
