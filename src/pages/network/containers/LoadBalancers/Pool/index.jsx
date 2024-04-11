import { inject, observer } from 'mobx-react';
import Base from 'containers/List';
import { PoolStore } from 'src/stores/octavia/pool';
import { actionConfigs } from './Actions';

export class Pools extends Base {
  init() {
    this.store = new PoolStore();
  }

  updateFetchParamsByPage = (params) => {
    const { id, ...rest } = params;
    return {
      loadbalancer_id: id,
      ...rest,
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
    return actionConfigs;
  }

  getColumns = () => [
    {
      title: t('ID/Name'),
      dataIndex: 'name',
      routeName: this.getRouteName('lbPoolDetail'),
      routeParamsFunc: (data) => {
        return {
          loadBalancerId: this.id,
          id: data.id,
        };
      },
    },
    {
      title: t('Admin State Up'),
      dataIndex: 'admin_state_up',
      render: (data) => data ? 'Yes' : 'No'
    },
    {
      title: t('Description'),
      dataIndex: 'description'
    },
    {
      title: t('Algorithm'),
      dataIndex: 'lb_algorithm'
    },
    {
      title: t('Protocol'),
      dataIndex: 'protocol' 
    },
    {
      title: t('Session Persistence'),
      dataIndex: 'session_persistence',
      render: (data) => data?.type || '-'
    },
    {
      title: 'TLS Enabled',
      dataIndex: 'tls_enabled',
      render: (data) => data ? 'Yes' : 'No'
    },
    {
      title: 'TLS Cipher string',
      dataIndex: 'tls_ciphers',
      copyable: true,
    }
  ]
}

export default inject('rootStore')(observer(Pools));