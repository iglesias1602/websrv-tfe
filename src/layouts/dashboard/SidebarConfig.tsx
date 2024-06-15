import React from 'react';
import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
import { NavItemConfig } from '@/models';

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig: NavItemConfig[] = [
    {
        title: 'dashboard',
        path: '/dashboard/app',
        icon: getIcon(pieChart2Fill)
    },
    {
        title: 'students',
        path: '/dashboard/user',
        icon: getIcon(peopleFill)
    },
    {
        title: 'labs',
        path: '/dashboard/labs',
        icon: getIcon(peopleFill)
    },
    {
        title: 'Not found',
        path: '/404',
        icon: getIcon(alertTriangleFill)
    }
];

export default sidebarConfig;
