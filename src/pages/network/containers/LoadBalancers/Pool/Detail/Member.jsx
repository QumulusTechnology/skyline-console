import { inject, observer } from 'mobx-react';
import Base from 'containers/List';
import { PoolMemberStore } from 'src/stores/octavia/pool-member';
import { memberActionConfigs } from '../Actions';

export class HealthMonitor extends Base {
  init() {
    this.store = new PoolMemberStore();
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
    return t('Pool Members')
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
    return memberActionConfigs;
  }

  getColumns = () => [
    {
      title: t('Name'),
      dataIndex: 'name'
    },
    {
      title: t('IP Address'),
      dataIndex: 'address',
    },
    {
        title: t('Admin State Up'),
        dataIndex: 'admin_state_up',
        render: (data) => data ? 'Yes' : 'No'
    },
    {
      title: t('Port'),
      dataIndex: 'protocol_port',
    },
    {
      title: t('Weight'),
      dataIndex: 'weight'
    },
    {
      title: t('Backup'),
      dataIndex: 'backup'
    },
    {
      title: t('Operating Status'),
      dataIndex: 'operating_status'
    },
    {
      title: t('Provisioning Status'),
      dataIndex: 'provisioning_status'
    },
  ]
}

export default inject('rootStore')(observer(HealthMonitor));