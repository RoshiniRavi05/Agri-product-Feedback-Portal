import React, { useState, useEffect, useRef } from 'react';
import { submitFeedback } from '../services/feedbackService';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const FeedbackForm = ({ product, onSuccess }) => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const [type, setType] = useState('text');
    const [rating, setRating] = useState(0);
    const [category, setCategory] = useState('Other');
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);

    const [isRecording, setIsRecording] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setText((prev) => (prev + ' ' + finalTranscript).trim());
                }
            };

            recognitionRef.current.onerror = () => {
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, []);

    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
        }
    }, [language]);

    const toggleRecording = () => {
        if (!recognitionRef.current) return;
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (type !== 'image' && !text.trim()) {
            return alert(t('enterComplaintDetailsAlert') || 'Please enter details');
        }

        if (type === 'image' && !image) {
            return alert(t('uploadImageAlert') || 'Please upload an image.');
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('feedback_type', type);
        formData.append('product_id', product.id);
        formData.append('review_title', category);
        formData.append('feedback_text', text);
        formData.append('complaint_category', category); // Legacy map
        formData.append('rating', rating);

        if (type === 'image' && image) {
            formData.append('image', image);
        }

        try {
            await submitFeedback(formData);
            alert(t('successSubmit') || 'Success!');
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            alert(t('submissionFailed') || 'Submission failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '25px' }}>
                <label>{t('selectTypeLabel') || 'Select Feedback Type'}</label>
                <select value={type} onChange={(e) => setType(e.target.value)} required>
                    <option value="text">{t('typeText') || 'Text'}</option>
                    <option value="voice">{t('typeVoice') || 'Voice'}</option>
                    <option value="image">{t('typeImage') || 'Image'}</option>
                </select>
            </div>

            <input type="hidden" value={product.id} readOnly />

            <div className="form-group">
                <label>Rate Product (Optional)</label>
                <div className="rating-container">
                    {[5, 4, 3, 2, 1].map(num => (
                        <React.Fragment key={num}>
                            <input
                                type="radio"
                                id={`star${num}`}
                                name="rating"
                                value={num}
                                checked={rating === String(num)}
                                onChange={(e) => setRating(e.target.value)}
                            />
                            <label htmlFor={`star${num}`}>★</label>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>Review Title</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Other">Other / General Feedback</option>
                    <option value="Quality">Quality Issue</option>
                    <option value="Effectiveness">Effectiveness / Yield Issue</option>
                    <option value="Packaging">Packaging Issue</option>
                    <option value="Fake Product">Suspected Fake Product</option>
                </select>
            </div>

            {(type === 'text' || type === 'voice' || type === 'image') && (
                <div className="form-group">
                    <label>{t('complaintDetailsLabel') || 'User Feedback'}</label>
                    <textarea
                        rows="5"
                        placeholder={t('complaintDetailsPlaceholder') || 'Write your feedback here...'}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    {type === 'voice' && (
                        <button
                            type="button"
                            className={`btn btn-secondary ${isRecording ? 'recording' : ''}`}
                            onClick={toggleRecording}
                            style={{ display: 'flex', marginTop: '10px' }}
                        >
                            {isRecording ? '🛑 ' + (t('stopVoiceOptions') || 'Stop') : '🎤 ' + (t('startVoiceOptions') || 'Start Voice Recording')}
                        </button>
                    )}
                </div>
            )}

            {type === 'image' && (
                <div className="form-group">
                    <label>{t('uploadImageLabel') || 'Upload Product Photo'}</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
            )}

            <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? (t('submittingBtn') || 'Submitting...') : (t('submitBtn') || 'Submit Feedback')}
            </button>
        </form>
    );
};

export default FeedbackForm;
