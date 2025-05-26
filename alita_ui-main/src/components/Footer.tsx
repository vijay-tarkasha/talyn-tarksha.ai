import TitleConfig from '../config/TitleConfig';
import './Footer.css';
import LanguageSwitcher from './LanguageSwitcher';
import Yt from '../../public/images/video.png';
import Ln from '../../public/images/linkedin.png'
import Fb from '../../public/images/communication.png'
import Tw from '../../public/images/twitter.png'

interface IFooterInput {
    width?: string
    responsive?: any
}
const Footer = (props: IFooterInput) => {
    const maxWidth = props.responsive ? "calc(100% - 0px)" : "calc(100% - 240px)";
    const width = props.width ? props.width : maxWidth
    return (
        <div className="page-footer-container" style={{ width: width }}>
            <div>
                <LanguageSwitcher />
            </div>
            <CopyRights />
            <div>
                <SocialMediaLinks />
            </div>
        </div>
    )
}

export default Footer


const CopyRights = () => {
    const currentYear = new Date().getFullYear();
    const title: any = TitleConfig.copyRight.text;
    return (
        <div>
            <p className="text-xs md:text-md text-gray-600 text-center">©{currentYear} {title} . Privacy . Terms</p>
        </div>
    )
}

const mediaLinks = [
    { link: Tw }, { link: Fb }, { link: Ln }, { link: Yt }
]
const SocialMediaLinks = () => {
    return (
        <div className='flex items-center gap-3'>
            {mediaLinks.map((d) => (
                <div key={d.link} className='w-[15px] cursor-pointer'>
                    <img src={d.link} className='h-full' />
                </div>
            ))}
        </div>
    )
}