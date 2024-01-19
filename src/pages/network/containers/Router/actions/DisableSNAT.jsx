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

import { ConfirmAction } from 'containers/Action';
import globalRouterStore from 'stores/neutron/router';

export default class CloseGateway extends ConfirmAction {
  get id() {
    return 'disable-snat';
  }

  get title() {
    return t('Disable SNAT');
  }

  get buttonText() {
    return t('Disable SNAT');
  }

  get actionName() {
    return t('Disable SNAT');
  }

  allowedCheckFunc = (item) => {
    const { hasExternalGateway, external_gateway_info } = item;

    return hasExternalGateway && external_gateway_info?.enable_snat;
  };

  policy = 'update_router';

  onSubmit = (item) => {
    const {
      id,
      external_gateway_info: { network_id },
    } = item;
    const body = {
      external_gateway_info: {
        network_id,
        enable_snat: false,
      },
    };
    console.log(body);
    return globalRouterStore.edit({ id }, body);
  };
}
