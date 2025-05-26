import { Popover } from "@mantine/core"
import { useState } from "react"
import { TbLockCog } from "react-icons/tb";
import { RiLogoutCircleLine } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";

interface IProfile {
    displayName: string
    handleLogOut?: any
    modalOpen?: any
}

const ProfileIcon = (props: IProfile) => {
    const { modalOpen, handleLogOut } = props;
    const [opened, setOpened] = useState<boolean>(false)

    const handlePwdChangeModelOpen = () => {
        modalOpen();
        setOpened(false);
    };

    const arrowStyles = {
        transform: opened ? 'rotate(-180deg)' : 'rotate(0deg)',
        transition: 'transform 0.3s ease',
    };

    return <div className="profile-menu"> <Popover width={200} position="bottom" withArrow
        opened={opened} onChange={setOpened}>
        <Popover.Target>
            <div className="display-name-text"
                onClick={() => setOpened(!opened)}>Welcome {props.displayName}
                <IoIosArrowDown style={arrowStyles} className='avathar-arrw-icon' />
            </div>
        </Popover.Target>
        <Popover.Dropdown>
            <div className="profile-menu-list-container">
                <ul>
                    <li onClick={handlePwdChangeModelOpen}>
                        <TbLockCog />
                        <span className='profile-sub-menu'>Change Password</span>
                    </li>
                    <li onClick={handleLogOut}>
                        <RiLogoutCircleLine />
                        <span className='profile-sub-menu'>Log out</span>
                    </li>
                </ul>
            </div>
        </Popover.Dropdown>
    </Popover>
    </div>
}

export { ProfileIcon }