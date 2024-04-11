// Copyright 2022 99cloud
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

import { isEmpty } from 'lodash';
import React from 'react';

export const operatingStatusCodes = {
  ONLINE: t('Online'),
  DRAINING: t('Draining'),
  OFFLINE: t('Offline'),
  DEGRADED: t('Degraded'),
  ERROR: t('Error'),
  NO_MONITOR: t('No Monitor'),
};

export const provisioningStatusCodes = {
  ACTIVE: t('Active'),
  DELETED: t('Deleted'),
  ERROR: t('Error'),
  PENDING_CREATE: t('Pending Create'),
  PENDING_UPDATE: t('Pending Update'),
  PENDING_DELETE: t('Pending Delete'),
};

export const certificateMode = {
  SERVER: t('Server Certificate'),
  CA: t('CA Certificate'),
};

export const certificateStatus = {
  ACTIVE: t('Active'),
  ERROR: t('Error'),
};

export const getCertificateColumns = (self) => [
  {
    title: t('Name'),
    dataIndex: 'name',
  },
  {
    title: t('Certificate Type'),
    dataIndex: 'mode',
    valueMap: certificateMode,
  },
  {
    title: t('Expires At'),
    dataIndex: 'expiration',
    valueRender: 'toLocalTime',
  },
  {
    title: t('Domain Name'),
    dataIndex: 'domain',
    render: (value) => value || '-',
  },
  {
    title: t('Listener'),
    dataIndex: 'listener',
    render: (value) => {
      return value
        ? value.map((it) => (
            <div key={it.id}>
              {self.getLinkRender(
                'lbListenerDetail',
                it.name,
                {
                  loadBalancerId: it.lb,
                  id: it.id,
                },
                null
              )}
            </div>
          ))
        : '-';
    },
  },
  {
    title: t('Status'),
    dataIndex: 'status',
    valueMap: certificateStatus,
  },
  {
    title: t('Created At'),
    dataIndex: 'created',
    valueRender: 'toLocalTime',
  },
];

export const sslParseMethod = [
  {
    label: t('One-way authentication'),
    value: 'one-way',
  },
  {
    label: t('Two-way authentication'),
    value: 'two-way',
  },
];

export const listenerProtocols = [
  {
    label: 'HTTP',
    value: 'HTTP',
  },
  {
    label: 'HTTPS',
    value: 'HTTPS',
  },
  {
    label: 'SCTP',
    value: 'SCTP',
  },
  {
    label: 'TCP',
    value: 'TCP',
  },
  {
    label: 'TERMINATED_HTTPS',
    value: 'TERMINATED_HTTPS',
  },
  {
    label: 'UDP',
    value: 'UDP',
  },
];

export const poolProtocols = [
  {
    label: 'HTTP',
    value: 'HTTP',
    listener: {
      http: 'valid',
      https: 'invalid',
      sctp: 'invalid',
      tcp: 'valid',
      terminatedHTTPS: 'valid',
      udp: 'invalid',
    },
  },
  {
    label: 'HTTPS',
    value: 'HTTPS',
    listener: {
      http: 'invalid',
      https: 'valid',
      sctp: 'invalid',
      tcp: 'valid',
      terminatedHTTPS: 'invalid',
      udp: 'invalid',
    },
  },
  {
    label: 'PROXY',
    value: 'PROXY',
    listener: {
      http: 'valid',
      https: 'valid',
      sctp: 'invalid',
      tcp: 'valid',
      terminatedHTTPS: 'valid',
      udp: 'invalid',
    },
  },
  {
    label: 'PROXYV2',
    value: 'PROXYV2',
    listener: {
      http: 'valid',
      https: 'valid',
      sctp: 'invalid',
      tcp: 'valid',
      terminated_https: 'valid',
      udp: 'invalid',
    },
  },
  {
    label: 'SCTP',
    value: 'SCTP',
    listener: {
      http: 'invalid',
      https: 'invalid',
      sctp: 'valid',
      tcp: 'invalid',
      terminatedHTTPS: 'invalid',
      udp: 'invalid',
    },
  },
  {
    label: 'TCP',
    value: 'TCP',
    listener: {
      http: 'invalid',
      https: 'valid',
      sctp: 'invalid',
      tcp: 'valid',
      terminatedHTTPS: 'invalid',
      udp: 'invalid',
    },
  },
  {
    label: 'UDP',
    value: 'UDP',
    listener: {
      http: 'invalid',
      https: 'invalid',
      sctp: 'invalid',
      tcp: 'invalid',
      terminatedHTTPS: 'invalid',
      udp: 'valid',
    },
  },
];

export const healthProtocols = [
  {
    label: 'HTTP',
    value: 'HTTP',
    pool: {
      http: 'valid',
      https: 'valid',
      proxy: 'valid',
      proxyv2: 'valid',
      sctp: 'valid',
      tcp: 'valid',
      udp: 'valid',
    },
  },
  {
    label: 'HTTPS',
    value: 'HTTPS',
    pool: {
      http: 'valid',
      https: 'valid',
      proxy: 'valid',
      proxyv2: 'valid',
      sctp: 'invalid',
      tcp: 'valid',
      udp: 'invalid',
    },
  },
  {
    label: 'PING',
    value: 'PING',
    pool: {
      http: 'valid',
      https: 'valid',
      proxy: 'valid',
      proxyv2: 'valid',
      sctp: 'invalid',
      tcp: 'valid',
      udp: 'invalid',
    },
  },
  {
    label: 'SCTP',
    value: 'SCTP',
    pool: {
      http: 'invalid',
      https: 'invalid',
      proxy: 'invalid',
      proxyv2: 'invalid',
      sctp: 'valid',
      tcp: 'invalid',
      udp: 'valid',
    },
  },
  {
    label: 'TCP',
    value: 'TCP',
    pool: {
      http: 'valid',
      https: 'valid',
      proxy: 'valid',
      proxyv2: 'valid',
      sctp: 'valid',
      tcp: 'valid',
      udp: 'valid',
    },
  },
  {
    label: 'TLS-HELLO',
    value: 'TLS-HELLO',
    pool: {
      http: 'valid',
      https: 'valid',
      proxy: 'valid',
      proxyv2: 'valid',
      sctp: 'invalid',
      tcp: 'valid',
      udp: 'invalid',
    },
  },
  {
    label: 'UDP-CONNECT',
    value: 'UDP-CONNECT',
    pool: {
      http: 'invalid',
      https: 'invalid',
      proxy: 'invalid',
      proxyv2: 'invalid',
      sctp: 'valid',
      tcp: 'invalid',
      udp: 'valid',
    },
  },
];

export const sessionPersitence = [
  {
    label: 'SOURCE_IP',
    value: 'SOURCE_IP',
  },
  {
    label: 'HTTP_COOKIE',
    value: 'HTTP_COOKIE',
  },
  {
    label: 'APP_COOKIE',
    value: 'APP_COOKIE',
  },
];

export const httpMethods = [
  {
    label: 'CONNECT',
    value: 'CONNECT'
  },
  {
    label: 'DELETE',
    value: 'DELETE'
  },
  {
    label: 'GET',
    value: 'GET'
  },
  {
    label: 'HEAD',
    value: 'HEAD'
  },
  {
    label: 'OPTIONS',
    value: 'OPTIONS'
  },
  {
    label: 'PATCH',
    value: 'PATCH'
  },
  {
    label: 'POST',
    value: 'POST'
  },
  {
    label: 'PUT',
    value: 'PUT'
  },
  {
    label: 'TRACE',
    value: 'TRACE'
  },
];

export const INSERT_HEADERS = {
  'X-Forwarded-For': t('Specify the client IP address'),
  'X-Forwarded-Port': t('Specify the listener port'),
  'X-Forwarded-Proto': '',
};

export const insertHeaderOptions = Object.keys(INSERT_HEADERS).map((key) => ({
  label: key,
  value: key,
}));

export const insertHeaderTips = (
  <>
    {Object.keys(INSERT_HEADERS).map((key) => {
      return (
        <p key={key}>
          {key}: {INSERT_HEADERS[key]}
        </p>
      );
    })}
  </>
);

export const insertHeaderDesc = t(
  'The optional headers to insert into the request before it is sent to the backend member.'
);

export const getListenerInsertHeadersFormItem = (hidden = false) => {
  return {
    name: 'insert_headers',
    label: t('Custom Headers'),
    type: 'check-group',
    hidden,
    extra: insertHeaderDesc,
    tip: insertHeaderTips,
    options: insertHeaderOptions,
  };
};

export const getInsertHeadersValueFromForm = (values) => {
  if (!values) {
    return null;
  }
  const result = {};
  Object.keys(INSERT_HEADERS).forEach((key) => {
    if (values[key]) {
      result[key] = 'true';
    }
  });
  return isEmpty(result) ? null : result;
};

export const getInsertHeadersFormValueFromListener = (listener) => {
  const { insert_headers } = listener || {};
  const result = {};
  Object.keys(INSERT_HEADERS).forEach((key) => {
    if (insert_headers[key]) {
      result[key] = insert_headers[key] === 'true';
    }
  });
  return result;
};

export const getInsertHeaderCard = (data) => {
  const options = [];
  Object.keys(INSERT_HEADERS).forEach((key) => {
    if (data[key]) {
      options.push({
        label: key,
        content: data[key],
        tooltip: INSERT_HEADERS[key],
      });
    }
  });
  return {
    title: t('Custom Headers'),
    titleHelp: insertHeaderDesc,
    options,
  };
};
