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
import JSEncrypt from 'jsencrypt';
import { ModalAction } from 'containers/Action';
import globalServerStore from 'stores/nova/instance';
import globalKeyPairStore from 'stores/nova/keypair';

export class RetrievePassword extends ModalAction {
  static id = 'retrieve-password';

  static title = t('Retrieve Instance Password');

  static buttonText = t('Retrieve Password');

  static okText = t('Decrypt');

  static get modalSize() {
    return 'middle';
  }

  static policy = 'os_compute_api:servers:update';

  static allowed() {
    return Promise.resolve(true);
  }

  init() {
    this.store = globalServerStore;
    this.keyPairStore = globalKeyPairStore;

    this.getEncryptedPassword();
  }

  get defaultValue() {
    const values = {
      keypairName: this.keyPairName,
      encryptedPassword: undefined,
      privateKey: undefined,
    };

    return values;
  }

  get keyPairName() {
    const { origin_data } = this.item;

    return origin_data.key_name || '';
  }

  get encryptTypes() {
    return [
      {
        label: t('Private Key File'),
        value: 'upload',
      },
      {
        label: t('Copy/Paste'),
        value: 'copyPaste',
      },
    ];
  }

  get hidePasswordKeySource() {
    const { encryptedPassword } = this.state;

    return !encryptedPassword;
  }

  get formItems() {
    return [
      {
        name: 'keypairName',
        label: t('Key Pair Name'),
        type: 'input',
        readOnly: true,
        tip: t('The Key Pair name that was associated with the instance.'),
      },
      {
        name: 'encryptedPassword',
        label: t('Encrypted Password'),
        type: 'textarea',
        tip: t('The instance password encrypted with your public key.'),
        readOnly: true,
        rows: 4,
      },
      {
        name: 'privateKey',
        label: t('Upload OR Copy/Paste Private Key'),
        type: 'textarea-from-file',
        hidden: this.hidePasswordKeySource,
        placeholder: t(' '),
        tip: t(
          'The private key will be only used in your browser and will not be sent to the server.'
        ),
        onChange: (value) => this.onChangePrivateKey(value),
        extra: t(
          'To decrypt your password you will need the private key of your key pair for this instance. Select the private key file, or copy and paste the content of your private key file into the text.'
        ),
        rows: 5,
      },
      {
        name: 'password',
        label: t('Password'),
        type: 'input',
        readOnly: true,
        hidden: this.hidePasswordKeySource,
      },
    ];
  }

  componentDidMount() {
    this.setState({
      isSubmitting: true,
    });
  }

  async getEncryptedPassword() {
    try {
      const { password } = await this.store.decryptPassword(this.item.id);

      this.updateFormValue(
        'encryptedPassword',
        password || t('Instance Password is not set or is not yet available')
      );

      this.setState({
        encryptedPassword: password,
      });
    } catch (err) {
    } finally {
      this.setState({
        isSubmitting: false,
      });
    }
  }

  decryptPassword(encryptedPassword, privateKey) {
    const crypt = new JSEncrypt();

    crypt.setKey(privateKey);

    return crypt.decrypt(encryptedPassword);
  }

  onChangePrivateKey(value) {
    this.setState({
      privateKey: value,
    });
  }

  onClickSubmit = () => {
    const { encryptedPassword, privateKey } = this.state;
    const password = this.decryptPassword(encryptedPassword, privateKey);

    this.updateFormValue('password', password || 'Invalid private key');
  };
}

export default inject('rootStore')(observer(RetrievePassword));
