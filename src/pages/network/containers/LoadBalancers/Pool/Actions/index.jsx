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

import EditPool from './EditPool';
import CreatePool from './CreatePool';
import DeletePool from './DeletePool';
import CreateHealthMonitor from './CreateHealthMonitor';
import EditHealthMonitor from './EditHealthMonitor';
import DeleteHealthMonitor from './DeleteHealthMonitor';
import EditMember from './EditMember';
import CreateMember from './CreateMember';
import DeleteMember from './DeleteMember';

export const actionConfigs = {
  rowActions: {
    firstAction: EditPool,
    moreActions: [
      {
        action: DeletePool
      }
    ],
  },
  primaryActions: [CreatePool]
};

export const hmActionConfigs = {
  rowActions: {
    firstAction: EditHealthMonitor,
    moreActions: [
      {
        action: DeleteHealthMonitor
      }
    ],
  },
  primaryActions: [CreateHealthMonitor]
};

export const memberActionConfigs = {
  rowActions: {
    firstAction: EditMember,
    moreActions: [
      {
        action: DeleteMember
      }
    ]
  },
  primaryActions: [CreateMember]
}