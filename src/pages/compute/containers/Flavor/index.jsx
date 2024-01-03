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

import { observer, inject } from 'mobx-react';
import Base from 'containers/TabList';
import globalSettingStore from 'stores/skyline/setting';
import { getAllCategories, x86CategoryList } from 'resources/nova/flavor';
import X86 from './X86';

export class Flavor extends Base {
  init() {
    this.settingStore = globalSettingStore;
    this.getSettings();
  }

  async getSettings() {
    await this.settingStore.fetchList();
    const categories = getAllCategories(this.settingStore.list.data).filter(
      (cat) =>
        cat.arch === 'x86_architecture' && cat.name !== 'high_clock_speed'
    );

    this.setState({
      categories,
    });
  }

  get tabs() {
    const { categories = [] } = this.state;
    return categories.map((it) => ({
      title: x86CategoryList[it.name],
      key: it.name,
      component: X86,
    }));
  }
}

export default inject('rootStore')(observer(Flavor));
