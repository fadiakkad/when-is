import React from 'react';
import SharedHelmet from '../common/Helmet';
import { websiteURL, websiteDomain } from '../common/constants';

const Contact = () => {
    const TITLE = "اتصل بنا";
    const DESCRIPTION = "معلومات الاتصال بموقع مواعيد";
    const KEYWORDS = "اتصل بنا, موقع مواعيد, معلومات الاتصال";
    const OG_URL = `${websiteURL}/contact-us/`;

    return (
        <div className="contact-container" style={{ padding: '20px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
            <SharedHelmet
                TITLE={TITLE}
                DESCRIPTION={DESCRIPTION}
                KEYWORDS={KEYWORDS}
                OG_URL={OG_URL}
            />
            <h1 style={{
                backgroundColor: '#65bee7',
                color: '#ffffff',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)',
                padding: '0 10px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                backgroundImage: 'linear-gradient(to right, #65bee7, #4ca3d3)',
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto',
            }}>
                اتصل بنا - موقع مواعيد
            </h1>
            <br />
            <p style={{ marginBottom: '15px', fontSize: '1.1rem' }}>
                للاتصال بنا يمكنك استخدام البريد الالكتروني التالي: 
                <a href={`mailto:info@${websiteDomain}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                    info@{websiteDomain}
                </a>
            </p>
            <p style={{ fontSize: '1.1rem' }}>
                نحن هنا لمساعدتك! إذا كان لديك أي استفسار حول موقع مواعيد، أو إذا كنت ترغب في تقديم اقتراحات لتحسين خدماتنا، فلا تتردد في التواصل معنا عبر البريد الإلكتروني المذكور أعلاه. فريقنا مستعد للاستماع إلى آرائك واقتراحاتك.
            </p>
            <p style={{ fontSize: '1.1rem' }}>
                سواء كنت تبحث عن معلومات حول الأحداث القادمة، أو تحتاج إلى مساعدة تقنية، أو لديك استفسارات عامة، نحن هنا لمساعدتك. نقدر تواصلك ونهدف إلى توفير أفضل تجربة ممكنة للمستخدمين.
            </p>
            <p style={{ fontSize: '1.1rem' }}>
                نرجو منكم الصبر في انتظار الرد، حيث قد يستغرق الأمر بعض الوقت حسب حجم الاستفسارات. شكرًا لكم على اهتمامكم بموقع مواعيد، ونتطلع إلى سماع آرائكم قريبًا!
            </p>
        </div>
    );
};

export default Contact;
