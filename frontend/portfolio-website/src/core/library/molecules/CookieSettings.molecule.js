import { useContext, useState } from 'react';
import { CookieContext } from '@/context/CookieContext';
import { base, header, content } from '@/styles/molecules/cookieSettings.module.scss';
import { Paragraph, Heading, Link } from '@/core/atoms/typography';
import { Button, Checkbox, Fieldset } from '@/core/atoms/form';
import RichText from './RichText.molecule';

const CookieSettings = () => {
    const { cookieSettings, saveSettings, cookieSettingsVisible } = useContext(CookieContext);
    const [localSettings, setLocalSettings] = useState(cookieSettings);

    if (!cookieSettingsVisible) {
        return null;
    }

    const handleSave = () => {
        saveSettings(localSettings);
    };

    const handleCheckboxChange = (e) => {
        setLocalSettings({
            ...localSettings,
            [e.target.name]: e.target.checked,
        });
    };

    return (
        <div className={base}>
            <header className={header}>
                <Heading level="2">Cookie Settings</Heading>
            </header>
            <div className={content}>
                <RichText>
                    <Paragraph>
                        You control how the website is using cookies. Find out more about the cookies we use below and
                        choose which you want to accept.
                    </Paragraph>
                    <Paragraph>
                        If you accept all cookies, the website can get better performances and you will see more
                        relevant content and faster. Your preferences will be saved for 1 year, and you can change them
                        at any time using the &quot;Cookie Settings&quot; link in the footer.
                    </Paragraph>
                    <Paragraph>
                        You can read more about the{' '}
                        <Link href="/cookie_policy" target="_blank" isInternal={true}>
                            Cookie Policy
                        </Link>
                        .
                    </Paragraph>
                </RichText>

                <Fieldset>
                    <Checkbox
                        checked={localSettings.essential}
                        name="essential"
                        disabled={true}
                        label="Essential cookies, required for website to function properly and security purposes. These cookies can't be disabled."
                        inputId="essentialCookiesCheck"
                    />
                    <Checkbox
                        checked={localSettings.analytics}
                        name="analytics"
                        onChange={handleCheckboxChange}
                        label="Analytics cookies, used to measure how the website is used. We use this information to improve the website experience."
                        inputId="analyticsCookiesCheck"
                    />
                    <Checkbox
                        checked={localSettings.marketing}
                        name="marketing"
                        onChange={handleCheckboxChange}
                        label="Marketing cookies, used to personalize ads and content based on your interests. This information may also be shared with third parties for this purpose."
                        inputId="marketingCookiesCheck"
                    />
                </Fieldset>

                <Button onClick={handleSave} styleType="primary">
                    Save Settings
                </Button>
            </div>
        </div>
    );
};

export default CookieSettings;
