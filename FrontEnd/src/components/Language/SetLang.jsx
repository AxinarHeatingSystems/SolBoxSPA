import React from 'react';
import { langugeCode_Store } from '../../store/actions/mainAction';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';


const languges = [
    { label: "English", code: "en" },
    { label: "Greek", code: "gr" },
    { label: "Spanish", code: "es" },
    { label: "Italian", code: "it" },
];

export const SetLang = ({ style }) => {

    const { i18n } = useTranslation();
    const dispatch = useDispatch();

    const onlanguageChagne = (e) => {
        console.log(e);
        i18n.changeLanguage(e.target.value);
        localStorage.setItem('langCode', e.target.value);
        dispatch(langugeCode_Store(e.target.value));
    }
    return (
        <select style={{ width: '100%' }} defaultValue={i18n.language} onChange={(e) => { onlanguageChagne(e) }}>
            {languges.map(({ code, label }) => (
                <option key={code} value={code}>
                    {label}
                </option>
            ))}
        </select>
    )
}
