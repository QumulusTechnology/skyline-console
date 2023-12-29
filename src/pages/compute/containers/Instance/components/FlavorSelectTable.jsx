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

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import SelectTable from 'components/FormItem/SelectTable';
import { Radio } from 'antd';
import globalSettingStore from 'stores/skyline/setting';
import globalFlavorStore from 'stores/nova/flavor';
import {
  flavorArchitectures,
  flavorCategoryList,
  getMinBaseColumns,
  gpuColumns,
  categoryHasIOPS,
  categoryHasEphemeral,
  isBareMetalFlavor,
  isBareMetal,
  isHeteroGenous,
  getFlavorSearchFilters,
} from 'resources/nova/flavor';
import styles from './index.less';

export class FlavorSelectTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arch: null,
      category: null,
    };
    this.init();
  }

  get labelStyle() {
    return {
      marginRight: 16,
    };
  }

  async getSettings() {
    await this.settingStore.fetchList();
    this.initDefaultValue();
  }

  async getFlavors() {
    const { allProjects = false } = this.props;
    await this.flavorStore.fetchList({ all_projects: allProjects });
    this.initDefaultValue();
  }

  get defaultFlavor() {
    const data = {
      data: this.flavors,
      tab: 'all',
      selectedRowKeys: undefined,
      selectedRows: undefined,
    };

    const { value } = this.props;

    if (
      value &&
      value.selectedRowKeys &&
      value.selectedRowKeys.length &&
      value.selectedRows &&
      value.selectedRows.length
    ) {
      const { selectedRowKeys, selectedRows } = value;

      data.selectedRowKeys = selectedRowKeys;
      data.selectedRows = selectedRows;
    } else if (this.flavors.length) {
      const dFlavor = this.flavors.find((it) => it.name === 't1.medium');

      if (dFlavor) {
        data.selectedRows = [dFlavor] || undefined;
        data.selectedRowKeys = [dFlavor.id] || undefined;
      }
    }

    return data;
  }

  get architectures() {
    const all = {
      architecture: 'all',
    };
    const { isIronic = false, filterIronic = true } = this.props;
    const item = (this.settingStore.list.data || []).find(
      (it) => it.key === 'flavor_families'
    );
    if (!item) {
      return [all];
    }
    let values = [];
    try {
      values = (item.value || []).filter((it) => {
        const { architecture } = it;
        if (architecture) {
          if (filterIronic) {
            return isIronic
              ? isBareMetal(architecture)
              : !isBareMetal(architecture) && !isHeteroGenous(architecture);
          }
          return true;
        }
        return false;
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
    return [all, ...values];
  }

  get categories() {
    const { arch } = this.state;
    if (!arch) {
      return [];
    }
    const item = this.architectures.find((it) => it.architecture === arch);
    return (item && item.categories) || [];
  }

  get flavors() {
    const {
      flavor,
      isIronic = false,
      filterIronic = true,
      excludeFlavors = [],
    } = this.props;
    const { arch, category } = this.state;
    if (!arch) {
      return [];
    }

    const dataFlavors = (this.flavorStore.list.data || [])
      .filter((it) => {
        if (excludeFlavors.length > 0) {
          return excludeFlavors.indexOf(it.id) < 0;
        }
        return true;
      })
      .filter((it) => {
        if (!flavor) {
          return true;
        }
        return it.name !== flavor;
      })
      .filter((it) => {
        if (!filterIronic) {
          return true;
        }
        return isIronic ? isBareMetalFlavor(it) : !isBareMetalFlavor(it);
      })
      .filter((it) => {
        if (arch === 'all') {
          return true;
        }

        return it.category === category;
      })
      .map((it) => ({
        ...it,
        key: it.id,
      }))
      .sort((a, b) => {
        return a.ram - b.ram || a.vcpus - b.vcpus;
      });

    return dataFlavors;
  }

  getBaseColumns() {
    const { category, arch } = this.state;
    const {
      minSize: { imageSize, ramSize },
    } = this.props;
    let base = [...getMinBaseColumns(ramSize, imageSize)];
    base[0].title = t('Name');
    base.splice(1, 1);
    if (!categoryHasIOPS(category)) {
      base = base.filter((it) => it.dataIndex !== 'quota:disk_total_iops_sec');
    }
    if (!categoryHasEphemeral(category)) {
      base = base.filter((it) => it.dataIndex !== 'OS-FLV-EXT-DATA:ephemeral');
    }
    if (arch === 'x86_architecture' || arch === 'all') {
      base = base.filter(
        (it) =>
          it.dataIndex !== 'quota:vif_outbound_average' &&
          it.dataIndex !== 'OS-FLV-EXT-DATA:ephemeral' &&
          it.dataIndex !== 'quota:disk_total_iops_sec' &&
          it.dataIndex !== 'quota:vif_outbound_average'
      );
    }
    return base;
  }

  getGpuColumns() {
    const { category } = this.state;
    if (category === 'compute_optimized_type') {
      return gpuColumns.filter((it) => it.dataIndex.indexOf('gpu') < 0);
    }
    return gpuColumns.filter((it) => it.dataIndex.indexOf('gpu') >= 0);
  }

  get columns() {
    const { arch } = this.state;
    const base = this.getBaseColumns();
    if (isBareMetal(arch)) {
      return [...base.filter((it, index) => index < 3)];
    }
    if (arch !== 'heterogeneous_computing') {
      return base;
    }
    const gpus = this.getGpuColumns();
    return [...base, ...gpus];
  }

  onArchChange = (e) => {
    const { value } = e.target;

    this.setState({
      arch: value,
      category: value === 'x86_architecture' ? 'general_purpose' : undefined,
    });
  };

  onCategoryChange = (e) => {
    this.setState({
      category: e.target.value,
    });
  };

  onChange = (value) => {
    const { onChange } = this.props;
    onChange && onChange(value);
  };

  disableRow(rec, minSize) {
    return rec.disk < minSize.imageSize ||
      Math.ceil(rec.ram / 1024) < minSize.ramSize
      ? styles['bg-disable']
      : '';
  }

  initDefaultValue() {
    const { value: { selectedRowKeys = [] } = {} } = this.props;
    if (selectedRowKeys.length > 0) {
      const flavor = (toJS(this.flavorStore.list.data) || []).find(
        (it) => it.id === selectedRowKeys[0]
      );
      if (flavor) {
        const { architecture, category } = flavor;
        this.setState({
          arch: architecture === 'custom' ? 'all' : architecture,
          category,
        });
      }
    } else {
      const arch = this.architectures[0].architecture;
      let category = null;
      if (this.architectures[0].categories) {
        category = this.architectures[0].categories[0].name;
      }
      this.setState({
        arch,
        category,
      });
    }
  }

  init() {
    this.settingStore = globalSettingStore;
    this.flavorStore = globalFlavorStore;
    this.getSettings();
    this.getFlavors();
  }

  renderArchButtons() {
    const { arch } = this.state;
    const items = this.architectures.map((it) => {
      const { architecture } = it;
      const label = flavorArchitectures[architecture] || architecture;
      return (
        <Radio.Button value={architecture} key={architecture}>
          {label}
        </Radio.Button>
      );
    });
    return (
      <Radio.Group
        id="flavor-select-arch"
        onChange={this.onArchChange}
        value={arch}
        buttonStyle="solid"
      >
        {items}
      </Radio.Group>
    );
  }

  renderCategoryButtons() {
    const { category } = this.state;
    const items = this.categories
      .filter((item) => item.name !== 'high_clock_speed')
      .map((it) => {
        const { name } = it;
        const label = flavorCategoryList[name] || name;
        return (
          <Radio.Button value={name} key={name}>
            {label}
          </Radio.Button>
        );
      });
    return (
      <Radio.Group
        id="flavor-select-category"
        onChange={this.onCategoryChange}
        value={category}
        buttonStyle="solid"
      >
        {items}
      </Radio.Group>
    );
  }

  renderArchSelect() {
    return (
      <div className={styles['flavor-tab']}>
        <span className={styles['flavor-label']}>{t('Architecture')}</span>
        {this.renderArchButtons()}
      </div>
    );
  }

  renderCategorySelect() {
    const { arch } = this.state;
    if (arch === 'all') {
      return null;
    }
    return (
      <div className={styles['flavor-tab']}>
        <span className={styles['flavor-label']}>{t('Category')}</span>
        {this.renderCategoryButtons()}
      </div>
    );
  }

  renderTableHeader() {
    return (
      <div>
        {this.renderArchSelect()}
        {this.renderCategorySelect()}
      </div>
    );
  }

  render() {
    const { value, disabledFunc, minSize } = this.props;
    const isLoading =
      this.settingStore.list.isLoading && this.flavorStore.list.isLoading;
    const props = {
      columns: this.columns,
      data: this.flavors,
      tableHeader: this.renderTableHeader(),
      isLoading,
      filterParams: getFlavorSearchFilters(),
      value,
      initValue: this.defaultFlavor,
      rowClassName: (rec) => this.disableRow(rec, minSize),
      onChange: this.onChange,
      disabledFunc,
    };
    return <SelectTable {...props} />;
  }
}

export default inject('rootStore')(observer(FlavorSelectTable));
