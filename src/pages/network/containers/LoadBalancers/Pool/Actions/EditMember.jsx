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
import globalPoolStore from 'src/stores/octavia/pool';
import { ModalAction } from 'containers/Action';

export class EditMember extends ModalAction {
  init() {
    this.store = globalPoolStore;
  }

  static id = 'pool-member-edit';

  static title = t('Edit Pool Member');

  static buttonText = t('Edit');

  get name() {
    return t('edit pool member`');
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

  static policy = 'os_load-balancer_api:pool:put';

  static allowed = () => true;

  get defaultValue() {
    const { id, name, address, protocol_port, weight, monitor_address, monitor_port, admin_state_up, backup } = this.item;

    return {
      id,
      name,
      address,
      protocol_port,
      weight,
      monitor_address,
      monitor_port,
      admin_state_up,
      backup
    };
  }

  get formItems() {
    return [
      {
        name: 'name',
        label: t('Health Monitor Name'),
        type: 'input-name',
      },
      {
        name: 'address',
        label: t('IP Address'),
        type: 'ip-input',
        disabled: true,
        required: true,
      },
      {
        name: 'protocol_port',
        label: t('Protocol Port'),
        type: 'input-number',
        disabled: true,
        required: true
      },
      {
        name: 'weight',
        label: t('Weight'),
        type: 'input-number',
        required: true
      },
      {
        name: 'monitor_address',
        label: t('Monitor Address'),
        type: 'ip-input',
      },
      {
        name: 'monitor_port',
        label: t('Monitor Port'),
        type: 'input-number',
      },
      {
        name: 'admin_state_up',
        label: t('Admin State Up'),
        type: 'switch'
      },
      {
        name: 'backup',
        label: t('Backup'),
        type: 'switch'
      },
    ]
  }

  onSubmit = (values) => {
    const { id: member_id } = this.item;
    const { containerProps: { detail = null } } = this.props;
    const pool_id = detail.id || null;

    delete values.protocol_port;
    delete values.address;

    return this.store.editPoolMember({pool_id, member_id}, values);
  };
}

export default inject('rootStore')(observer(EditMember));
