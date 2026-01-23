import React from 'react';
import { Skeleton } from '@mui/material';

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
    rows = 5,
    columns = 8,
}) => (
    <div className="table-wrapper">
        <table className="table custom-table table-bordered" style={{ fontSize: 14 }}>
            <thead className="fw-normal">
                <tr>
                    <th style={{ width: '120px' }}>
                        <Skeleton variant="text" width="80%" height={32} />
                    </th>
                    {Array(columns).fill(0).map((_, i) => (
                        <th key={i}>
                            <Skeleton variant="text" width="60%" height={28} />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Array(rows).fill(0).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Skeleton variant="circular" width={32} height={32} />
                                <Skeleton variant="circular" width={32} height={32} />
                            </div>
                        </td>
                        {Array(columns).fill(0).map((_, colIndex) => (
                            <td key={colIndex}>
                                <Skeleton variant="text" width={colIndex === 1 ? "120px" : "100%"} />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
