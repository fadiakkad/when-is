import React from 'react';
import SharedHelmet from '../common/Helmet';
import { websiteURL } from '../common/constants';

const About = () => {
    const TITLE = "حول موقع مواعيد";
    const DESCRIPTION = "موقع مواعيد يمكنك من خلاله البحث عن الاحداث القادمة في العالم العربي والدول العربية ومعرفة كم باقي على موعد الاحداث القادمة";
    const KEYWORDS = "عد تنازلي, إنشاء عد تنازلي, مناسبة, تاريخ, ساعة, موقع مواعيد";
    const OG_URL = `${websiteURL}/عن_مواعيد/`;

    return (
        <div className="about-container" style={{  padding: '20px', lineHeight: '1.6' }}>
            <SharedHelmet
                TITLE={TITLE}
                DESCRIPTION={DESCRIPTION}
                KEYWORDS={KEYWORDS}
                OG_URL={OG_URL}
            />
            <h1
                style={{
                    backgroundColor: '#65bee7',
                    color: '#ffffff',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',  // Reduced base font size
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)',
                    padding: '0 10px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    backgroundImage: 'linear-gradient(to right, #65bee7, #4ca3d3)',
                    width: '100%',
                    maxWidth: '800px',  // Limits width on larger screens
                    margin: '0 auto',
                   
                }}
                className="text-white"
            >
                حول موقع مواعيد
            </h1>
            <br/>
            <p style={{ marginBottom: '15px' }}>
                يسعى موقع مواعيد إلى توفير تجربة فريدة للمستخدمين من خلال تقديم معلومات دقيقة ومحدثة حول الأحداث المهمة في العالم العربي. إليك بعض النقاط الرئيسية عن الموقع:
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '20px' }}>
                <li>تقديم العد التنازلي لأهم الأحداث، مثل:</li>
                <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
                    <li>شهر رمضان المبارك</li>
                    <li>عيد الفطر وعيد الأضحى</li>
                    <li>بطولة كأس العالم</li>
                    <li>بدء العام الدراسي في الدول العربية</li>
                </ul>
                <li>سهولة البحث عن الأحداث القادمة في مختلف الدول العربية.</li>
                <li>معرفة المواعيد بدقة ومعرفة الوقت المتبقي لكل حدث.</li>
                <li>تقديم معلومات محدثة لمساعدة المستخدمين على التخطيط لمناسباتهم.</li>
            </ul>
            <p>
                نحن نؤمن أن المعلومات الدقيقة والمحدثة تعزز من تجارب المستخدمين وتساعدهم في اتخاذ القرارات المناسبة حول أحداثهم المهمة. نرحب بجميع الزوار لاستكشاف الموقع والاستفادة من المحتوى الغني الذي نقدمه.
            </p>
            <p>
                إذا كان لديك أي أسئلة أو استفسارات، فلا تتردد في الاتصال بنا أو زيارة قسم الدعم الفني لدينا للحصول على المزيد من المساعدة.
            </p>
        </div>
    );
};

export default About;
