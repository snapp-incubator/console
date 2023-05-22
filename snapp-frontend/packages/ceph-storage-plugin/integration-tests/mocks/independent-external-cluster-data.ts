export const ClusterMetadata = [
  {
    kind: 'ConfigMap',
    data: { maxMonId: '0', data: 'a=10.97.47.226:6789', mapping: {} },
    name: 'rook-ceph-mon-endpoints',
  },
  {
    kind: 'Secret',
    data: {
      'mon-secret': 'mon-secret',
      fsid: 'b99e887c-9f73-47e7-96cc-33c6f3f39aa9',
      'cluster-name': 'openshift-storage',
      'admin-secret': 'admin-secret',
    },
    name: 'rook-ceph-mon',
  },
  {
    kind: 'Secret',
    data: {
      userKey: '***REMOVED***',
      userID: 'client.healthchecker',
    },
    name: 'rook-ceph-operator-creds',
  },
  {
    kind: 'Secret',
    data: { userKey: '***REMOVED***', userID: 'csi-rbd-node' },
    name: 'rook-csi-rbd-node',
  },
  {
    kind: 'Secret',
    data: {
      userKey: '***REMOVED***',
      userID: 'csi-rbd-provisioner',
    },
    name: 'rook-csi-rbd-provisioner',
  },
  {
    kind: 'Secret',
    data: {
      adminID: 'csi-cephfs-node',
      adminKey: '***REMOVED***',
    },
    name: 'rook-csi-cephfs-node',
  },
  {
    kind: 'Secret',
    data: {
      adminID: 'csi-cephfs-provisioner',
      adminKey: '***REMOVED***',
    },
    name: 'rook-csi-cephfs-provisioner',
  },
  { kind: 'StorageClass', data: { pool: 'myfs-data0' }, name: 'ceph-rbd' },
  { kind: 'StorageClass', data: { pool: 'myfs-data0', fsName: 'myfs' }, name: 'cephfs' },
  { kind: 'StorageClass', data: { endpoint: '10.10.212.122:9000' }, name: 'ceph-rgw' },
];
