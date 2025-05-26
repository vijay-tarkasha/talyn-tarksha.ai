interface IProfileImg {
    name: string,
    id: any,
    className?: string
}

const ProfileImage = (props: IProfileImg) => {
    const { name, id, className } = props;
    const nameParts = name?.split(" ");
    const firstNameInitial = nameParts?.[0] ? nameParts[0][0] : "";
    const lastNameInitial = nameParts?.[1] ? nameParts[1][0] : "";
    const initials = firstNameInitial + lastNameInitial + id;

    const generateRandomColor = (initials: string) => {
        let hash = 0;
        for (let i = 0; i < initials.length; i++) {
            hash = initials.charCodeAt(i) + ((hash << 5) - hash);
        }

        const r = (Math.abs(hash) % 256);
        const g = (Math.abs(hash >> 8) % 256);
        const b = (Math.abs(hash >> 16) % 256);

        const rColor = (r + 100) % 256;
        const gColor = (g + 150) % 256;
        const bColor = (b + 200) % 256;
        const a = 1;
        return `rgba(${rColor}, ${gColor}, ${bColor}, ${a})`;
    };

    const randomColor = generateRandomColor(initials);

    return (<>
        <span className={`text-white font-weight-bold flex justify-center items-center
            p-[10px] rounded-[50%] ${className}`}
            style={{
                backgroundColor: randomColor,
                // fontSize: fontSize ? fontSize : '12px',
                // height: size ? size : '24px', width: size ? size : '24px'
            }}>
            {firstNameInitial}
            {lastNameInitial}
        </span>
    </>);
};

export default ProfileImage;