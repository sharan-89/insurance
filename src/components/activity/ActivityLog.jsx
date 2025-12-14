import React from 'react';
import Table from '../common/Table';
import { formatDateTime } from '../../utils/formatters';

const ActivityLog = ({ activities = [] }) => {
  const columns = [
    { key: 'action', label: 'Action' },
    { key: 'entityType', label: 'Entity Type' },
    { key: 'entityId', label: 'Entity ID' },
    { key: 'userId', label: 'User ID' },
    { key: 'timestamp', label: 'Timestamp', render: (value) => formatDateTime(value) }
  ];

  return <Table columns={columns} data={activities} />;
};

export default ActivityLog;

