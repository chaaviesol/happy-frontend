import React from 'react';
import './OperationalExpenses.css';

export const InputModal = ({ isOpen, onClose, onConfirm, title, placeholder, initialValue = '', confirmText = 'Confirm' }) => {
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        if (isOpen) setValue(initialValue);
    }, [isOpen, initialValue]);

    if (!isOpen) return null;

    return (
        <div className="overlay-backdrop">
            <div className="modal-container">
                <h3 className="modal-title">{title}</h3>
                <input
                    type="text"
                    className="modal-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <div className="modal-actions">
                    <button className="modal-btn confirm" onClick={() => onConfirm(value)}>
                        {confirmText}
                    </button>
                    <button className="modal-btn cancel" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName, categoryName }) => {
    if (!isOpen) return null;

    return (
        <div className="overlay-backdrop">
            <div className="modal-container">
                <h3 className="modal-title">Are you sure you want to delete {categoryName} Category?</h3>
                <p className="modal-text">This action cannot be undone.</p>
                <div className="modal-actions">
                    <button className="modal-btn delete" onClick={onConfirm}>
                        Delete
                    </button>
                    <button className="modal-btn cancel" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
