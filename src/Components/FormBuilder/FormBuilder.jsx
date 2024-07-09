import React, { useState } from 'react';
import { ChromePicker } from 'react-color'; // Importa el selector de colores
import './css/FormBuilder.css';

const FormBuilder = ({ onSave }) => {
    const [questions, setQuestions] = useState([]);
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [customizationOpen, setCustomizationOpen] = useState(false);
    const [headerColor, setHeaderColor] = useState('');
    const [questionBorderColor, setQuestionBorderColor] = useState('');
    const [formBackgroundColor, setFormBackgroundColor] = useState('');
    const [addingQuestionType, setAddingQuestionType] = useState(false);

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('index', index.toString());
        e.currentTarget.classList.add('dragging');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('dragging');
    };

    const handleDrop = (e, newIndex) => {
        e.preventDefault();
        const oldIndex = parseInt(e.dataTransfer.getData('index'));
        if (oldIndex !== newIndex) {
            const newQuestions = [...questions];
            const [removed] = newQuestions.splice(oldIndex, 1);
            newQuestions.splice(newIndex, 0, removed);
            setQuestions(newQuestions);
        }
    };

    const addQuestion = (type) => {
        const newQuestion = {
            id: `question-${Date.now()}`,
            type,
            content: '',
            answer: '',
            options: []
        };

        if (type === 'short-answer') {
            newQuestion.answerPlaceholder = 'Respuesta Corta';
        } else if (type === 'long-answer') {
            newQuestion.answerPlaceholder = 'Respuesta Larga';
        }

        setQuestions([...questions, newQuestion]);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleQuestionTypeChange = (index, type) => {
        const newQuestions = [...questions];
        newQuestions[index] = {
            ...newQuestions[index],
            type,
            answerPlaceholder: type === 'short-answer' ? 'Respuesta Corta' : type === 'long-answer' ? 'Respuesta Larga' : undefined
        };
        setQuestions(newQuestions);
    };

    const handleQuestionContentChange = (index, content) => {
        const newQuestions = [...questions];
        newQuestions[index] = {
            ...newQuestions[index],
            content
        };
        setQuestions(newQuestions);
    };

    const handleAnswerChange = (index, answer) => {
        const newQuestions = [...questions];
        newQuestions[index] = {
            ...newQuestions[index],
            answer
        };
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex] = {
            ...newQuestions[questionIndex],
            options: newQuestions[questionIndex].options.map((option, idx) =>
                idx === optionIndex ? value : option
            )
        };
        setQuestions(newQuestions);
    };

    const addOption = (index) => {
        const newQuestions = [...questions];
        newQuestions[index] = {
            ...newQuestions[index],
            options: [...newQuestions[index].options, '']
        };
        setQuestions(newQuestions);
    };

    const saveForm = () => {
        const newForm = {
            title: formTitle,
            description: formDescription,
            startDate,
            endDate,
            questions
        };
        onSave(newForm);
    };

    const handleColorChange = (color) => {
        if (customizationOpen === 'header') {
            setHeaderColor(color.hex);
        } else if (customizationOpen === 'question') {
            setQuestionBorderColor(color.hex);
        } else if (customizationOpen === 'background') {
            setFormBackgroundColor(color.hex);
        }
    };

    const toggleCustomization = () => {
        setCustomizationOpen(!customizationOpen);
    };

    const openColorPicker = (type) => {
        setCustomizationOpen(type);
    };

    const toggleAddingQuestionType = () => {
        setAddingQuestionType(!addingQuestionType);
    };

    return (
        <div className="form-builder-container">
            <div className="form-builder" style={{ borderTop: headerColor ? `8px solid ${headerColor}` : 'none', backgroundColor: formBackgroundColor }}>
                <input type="text" placeholder="Título del Formulario" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
                <textarea placeholder="Descripción del Formulario" value={formDescription} onChange={(e) => setFormDescription(e.target.value)}></textarea>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <div className="questions">
                    {questions.map((question, index) => (
                        <div
                            key={question.id}
                            className="question-item"
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            style={{ borderLeft: questionBorderColor ? `5px solid ${questionBorderColor}` : 'none' }}
                        >
                            <input
                                type="text"
                                placeholder="Pregunta"
                                value={question.content}
                                onChange={(e) => handleQuestionContentChange(index, e.target.value)}
                            />
                            {question.type === 'short-answer' && (
                                <input
                                    type="text"
                                    placeholder={question.answerPlaceholder}
                                    value={question.answer}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                />
                            )}
                            {question.type === 'long-answer' && (
                                <textarea
                                    placeholder={question.answerPlaceholder}
                                    value={question.answer}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                />
                            )}
                            <select
                                value={question.type}
                                onChange={(e) => handleQuestionTypeChange(index, e.target.value)}
                            >
                                <option value="short-answer">Respuesta Corta</option>
                                <option value="long-answer">Respuesta Larga</option>
                                <option value="multiple-choice">Selección Múltiple</option>
                                <option value="checkboxes">Casillas de Verificación</option>
                                <option value="dropdown">Desplegable</option>
                                <option value="rating-scale">Escala de Calificación</option>
                            </select>
                            {(question.type === 'multiple-choice' || question.type === 'checkboxes' || question.type === 'dropdown') && (
                                <div>
                                    {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex}>
                                            <input
                                                type={question.type === 'checkboxes' ? 'checkbox' : 'radio'}
                                                checked={false}
                                                readOnly
                                            />
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                                placeholder={`Opción ${optionIndex + 1}`}
                                            />
                                        </div>
                                    ))}
                                    <button onClick={() => addOption(index)}>Agregar Opción</button>
                                </div>
                            )}
                            <button onClick={() => removeQuestion(index)}>Eliminar</button>
                        </div>
                    ))}
                </div>
                <button className="save-button" onClick={saveForm}>Guardar Formulario</button>
            </div>
            <div className="side-menu">
                <div className="add-question-dropdown">
                    <button onClick={toggleAddingQuestionType} className='btn-sidena-forms'>Agregar Pregunta</button>
                    {addingQuestionType && (
                        <div className="customization-options">
                            <button onClick={() => addQuestion('short-answer')} className='select-question-type'>Respuesta Corta</button>
                            <button onClick={() => addQuestion('long-answer')} className='select-question-type'>Respuesta Larga</button>
                            <button onClick={() => addQuestion('multiple-choice')} className='select-question-type'>Selección Múltiple</button>
                            <button onClick={() => addQuestion('checkboxes')} className='select-question-type'>Casillas de Verificación</button>
                            <button onClick={() => addQuestion('dropdown')} className='select-question-type'>Desplegable</button>
                            <button onClick={() => addQuestion('rating-scale')} className='select-question-type'>Escala de Calificación</button>
                        </div>
                    )}
                </div>
                <div className="customization">
                    <button onClick={toggleCustomization} className='btn-sidena-forms'>Personalización</button>
                    {customizationOpen && (
                        <div className="customization-options">
                            <button onClick={() => openColorPicker('header')} className='select-question-type'>Color de Encabezado</button>
                            <button onClick={() => openColorPicker('question')} className='select-question-type'>Color de Pregunta</button>
                            <button onClick={() => openColorPicker('background')} className='select-question-type'>Color de Fondo</button>
                            {customizationOpen === 'header' && (
                                <ChromePicker color={headerColor} onChangeComplete={(color) => handleColorChange(color)} />
                            )}
                            {customizationOpen === 'question' && (
                                <ChromePicker color={questionBorderColor} onChangeComplete={(color) => handleColorChange(color)} />
                            )}
                            {customizationOpen === 'background' && (
                                <ChromePicker color={formBackgroundColor} onChangeComplete={(color) => handleColorChange(color)} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormBuilder;
