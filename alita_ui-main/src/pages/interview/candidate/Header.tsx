import BuildImg from '../../../../public/images/buildimg.png';

const Header = ({ data }: any) => {
    const jobTitle = data?.jobPosting?.job_title;
    const title = jobTitle ? jobTitle : "Candidate"
    // const companyName = data?.jobPosting?.company

    return <>
        <div className="flex items-center justify-between instruction-header mt-2 sticky top-0 z-20 bg-white">
            <div className="h-[80px] w-[80px] cursor-pointer ">
                <img src={BuildImg} alt="company" className='h-full'/>
            </div>
            <h3 className="text-base md:text-lg font-semibold text-center">Interview for {title}</h3>
            <div></div>
        </div>
    </>
}

export { Header };
