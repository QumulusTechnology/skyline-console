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

import { action } from 'mobx';
import client from 'client';
import Base from 'stores/base';

export class DNSZonesStore extends Base {

  get client() {
    return client.designate.zones;
  }

  @action
  async create(newbody) {
    return this.submitting(this.client.create(newbody));
  }

  @action
  delete = ({ id }) => this.submitting(this.client.delete(id));

  @action
  update = ({ id }, body) => this.submitting(this.client.patch(id, body));

}

const globalDNSZonesStore = new DNSZonesStore();
export default globalDNSZonesStore;