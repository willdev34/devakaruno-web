export const ColorConfiguration = () => {
    return (
        <>
            <h3 className=" text-black text-xl font-semibold mt-8 dark:text-white" >Colors</h3>
            <div className="p-6 rounded-md border mt-4 border-border dark:border-dark_border">
                <p className="text-base font-medium text-midnight_text dark:text-white/50" ><span className="font-semibold text-lg dark:text-white">1. Override Colors</span> <br />
                    For any change in colors : /src/utils/extendedConfig.ts</p>
                <div className="py-4 px-5 rounded-md bg-black mt-8">
                    <p className="text-sm text-gray-400 flex flex-col gap-2">
                        <span>--color-primary: #1AB7BA;</span>
                        <span>--color-darkprimary: #28cf91;</span>
                        <span>--color-secondary: #1dc8cd;</span>
                        <span>--color-midnight_text: #263238;</span>
                        <span>--color-muted: #8d97b7;</span>
                        <span>--color-error: #ff4d7e;</span>
                        <span>--color-warning: #ff6a5b;</span>
                        <span>--color-light_grey: #e9ecef;</span>
                        <span>--color-grey: #f5f7fa;</span>
                        <span>--color-border: #e1e1e1;</span>
                        <span>--color-success: #3cd278;</span>
                        <span>--color-darkmode: #0a2219;</span>
                        <span>--color-darklight: #000f30;</span>
                        <span>--color-dark_border: #203535;</span>
                        <span>--color-dark: #00180f;</span>
                        <span>--color-dustGray: #464A59;</span>
                    </p>
                </div>
            </div>
            <div className="p-6 rounded-md border mt-4 border-border dark:border-dark_border">
                <p className="text-base font-medium text-midnight_text dark:text-white/50" ><span className="font-semibold text-lg dark:text-white">2. Override Theme Colors</span> <br />
                    For change , go to : /src/utils/extendedConfig.ts</p>
                <div className="py-4 px-5 rounded-md bg-black mt-8">
                    <p className="text-sm text-gray-400 flex flex-col gap-2">
                        <span>--color-primary: #1AB7BA;</span>
                        <span>--color-darkprimary: #28cf91;</span>
                    </p>
                </div>
            </div>
        </>
    )
}