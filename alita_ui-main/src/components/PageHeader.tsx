interface IPageHeaderInputs {
    title: string
    rightContent?: any
}

const PageHeader = (props: IPageHeaderInputs) => {
    const { title, rightContent } = props;
    return (
        <div className="flex justify-between items-center w-full px-5 py-0 sticky top-0 bg-white z-10">
            <div className="text-xl sm:text-lg md:text-xl font-semibold">
                {title}
            </div>
            <div>
                {rightContent}
            </div>
        </div>
    )
}

export default PageHeader
