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
import Base from 'containers/TabDetail';
import { SegmentStore } from 'stores/masakari/segments';
import BaseDetail from './BaseDetail';
import actionConfigs from '../actions';
import HostDetail from '../../Hosts';

export class SegmentsDetail extends Base {
  init() {
    this.store = new SegmentStore();
  }

  get name() {
    return t('Segment Detail');
  }

  get listUrl() {
    return this.getRoutePath('masakariSegments');
  }

  get policy() {
    return 'capsule:get_one_all_projects';
  }

  get actionConfigs() {
    return actionConfigs;
  }

  get detailInfos() {
    return [
      {
        title: t('Name'),
        dataIndex: 'name',
      },
      {
        title: t('Description'),
        dataIndex: 'description',
      },
    ];
  }

  get tabs() {
    return [
      {
        title: t('Detail'),
        key: 'general_info',
        component: BaseDetail,
      },
      {
        title: t('Hosts'),
        key: 'host',
        component: HostDetail,
      },
    ];
  }
}

export default inject('rootStore')(observer(SegmentsDetail));
