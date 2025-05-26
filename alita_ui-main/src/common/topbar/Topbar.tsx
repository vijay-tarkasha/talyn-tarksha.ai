import { ActionIcon } from '@mantine/core';
import { IoMenu } from "react-icons/io5";
import './Topbar.css';

interface TopbarProps {
  mobileOpen?: boolean,
  setMobileOpen?: any,
  display?: any,
  height?: string
}

const Topbar = (props: TopbarProps) => {
  const { setMobileOpen, mobileOpen, display } = props;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  }
  const height = props.height ? props.height : '50px';
  return (<div>
    <div className='topbar' style={{ height: height }}>
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
    </div>
  </div>

  );
};

export default Topbar;