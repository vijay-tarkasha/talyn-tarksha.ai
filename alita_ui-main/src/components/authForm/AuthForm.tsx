import Footer from '../Footer';
import Logo from '../../../public/images/tallogo.png';

interface IAuthInputs {
    formlet: any;
    title: string;
    img: any;
}

const AuthForm = (props: IAuthInputs) => {
    const FormLet = props.formlet;
    const Image = props.img;
    return (
        <div className="min-h-screen flex flex-col justify-center items-center w-full p-4 md:p-6 lg:p-8">
            <div className="container max-w-6xl mx-auto">
                <div className="flex-1 overflow-y-auto pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center">
                        <div className="w-full h-full flex flex-col items-start text-center md:text-left px-4 md:px-6">
                            <div className="mb-4">
                                <img src={Logo} className="w-30 md:w-30 lg:w-30 rounded auth-logo" alt="Logo" />
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-left">{props.title}</div>
                            <div className={`mt-6 w-full max-h-[75vh] overflow-y-auto`}>
                                <FormLet />
                            </div>
                        </div>
                        <div className="hidden md:grid place-items-center h-full mt-8 md:mt-0">
                            <img src={Image} className="auth-img" alt="Auth Illustration" />
                        </div>
                    </div>
                </div>

            </div>
            <div className="w-full mt-auto" style={{
                position: 'fixed', maxHeight: '50px',
                bottom: 0, left: 0, right: 0
            }}>
                <Footer width='100%' />
            </div>
        </div>
    );
};

export default AuthForm;