import { inject, observer } from 'mobx-react';
import Base from 'containers/List';
import { HealthMonitorStore } from 'src/stores/octavia/health-monitor';
import { hmActionConfigs } from '../Actions';

export class HealthMonitor extends Base {
  init() {
    this.store = new HealthMonitorStore();
  }

  updateFetchParamsByPage = (params) => {
    const { id } = params;
    return {
      pool_id: id,
    };
  };

  get policy() {
    return 'os_load-balancer_api:pool:get_all';
  }

  get name() {
    return t('Pools')
  }

  get id() {
    return this.params.id;
  }

  get isFilterByBackend() {
    return true;
  }

  get forceRefreshTopDetailWhenListRefresh() {
    return true;
  }

  get actionConfigs() {
    return hmActionConfigs;
  }

  getColumns = () => [
    {
      title: t('ID/Name'),
      dataIndex: 'name',
    },
    {
      title: t('Admin State Up'),
      dataIndex: 'admin_state_up',
      render: (data) => data ? 'Yes' : 'No'
    },
    {
      title: t('Health Monitor Type'),
      dataIndex: 'type'
    },
    {
      title: t('Health Monitor Delay'),
      dataIndex: 'delay'
    },
    {
      title: t('Health Monitor Max Retries'),
      dataIndex: 'max_retries'
    },
    {
      title: t('Health Monitor Timeout'),
      dataIndex: 'timeout'
    },
  ]
}

export default inject('rootStore')(observer(HealthMonitor));