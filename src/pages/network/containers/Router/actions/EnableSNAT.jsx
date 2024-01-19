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
    return 'enable-snat';
  }

  get title() {
    return t('Enable SNAT');
  }

  get buttonText() {
    return t('Enable SNAT');
  }

  get actionName() {
    return t('Enable SNAT');
  }

  policy = 'update_router';

  allowedCheckFunc = (item) => {
    const { hasExternalGateway, external_gateway_info } = item;

    return hasExternalGateway && !external_gateway_info?.enable_snat;
  };

  onSubmit = (item) => {
    const {
      id,
      external_gateway_info: { network_id },
    } = item;
    const body = {
      external_gateway_info: {
        network_id,
        enable_snat: true,
      },
    };
    return globalRouterStore.edit({ id }, body);
  };
}
