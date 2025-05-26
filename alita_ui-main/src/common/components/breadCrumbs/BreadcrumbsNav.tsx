import { Breadcrumbs, Anchor, ActionIcon } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { appRoutes } from '../../../routes/appRoutes';
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { IoHome, IoMenu } from "react-icons/io5";
import './BreadCrumbs.css'

function findRoute(pathname: any) {
    return appRoutes.find((route) => route.path === pathname);
}

function generateBreadcrumbs(pathSegments: any) {
    const breadcrumbs = [];
    let currentPath = '';
    const segmentsToUse = pathSegments.slice(1);
    const filteredSegments = segmentsToUse.filter((segment: any) => segment !== 'dashboard');

    for (const segment of filteredSegments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        const route = findRoute(currentPath);
        if (route) {
            breadcrumbs.push(
                <Anchor component={Link} to={currentPath} key={currentPath}>
                    {route.name}
                </Anchor>
            );
        }
    }
    return breadcrumbs;
}

interface IOptions {
    display?: string
    mobileOpen?: any;
    setMobileOpen?: any;
}
function BreadcrumbsNav(props: IOptions) {
    const { display, mobileOpen, setMobileOpen } = props;
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = generateBreadcrumbs(pathSegments);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    }

    return (<div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
        <div>
            <ActionIcon
                variant="outline"
                color="gray"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                style={{ marginRight: 24, display: display }}
            >
                <IoMenu />
            </ActionIcon>
        </div>
        <Breadcrumbs separator={<MdKeyboardDoubleArrowRight />} className='breadcrumb-container'>
            <Anchor className='breadcrumb-anchor' component={Link} to="/app/dashboard">
                <IoHome />
                Home</Anchor>
            {breadcrumbs}
        </Breadcrumbs>
    </div>
    );
}

export default BreadcrumbsNav;