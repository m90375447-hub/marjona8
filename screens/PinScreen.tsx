import React, { useState, useEffect } from 'react';
import { BackspaceIcon } from '../components/icons';

const PIN_LENGTH = 4;

interface PinScreenProps {
  mode: 'set' | 'enter';
  storedPin?: string;
  onPinSet?: (pin: string) => void;
  onSuccess?: () => void;
}

const PinScreen: React.FC<PinScreenProps> = ({ mode, storedPin, onPinSet, onSuccess }) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [step, setStep] = useState<'initial' | 'confirm'>('initial');
  const [tempPin, setTempPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);


  const getTitle = () => {
    if (mode === 'set') {
      return step === 'initial' ? "Yangi PIN o'rnating" : "PIN-kodni tasdiqlang";
    }
    return 'PIN-kodni kiriting';
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  useEffect(() => {
    if (enteredPin.length === PIN_LENGTH) {
      if (mode === 'enter') {
        if (enteredPin === storedPin) {
          onSuccess?.();
        } else {
          setError('PIN-kod xato.');
          triggerShake();
          setEnteredPin('');
        }
      } else { // mode === 'set'
        if (step === 'initial') {
          setTempPin(enteredPin);
          setEnteredPin('');
          setStep('confirm');
        } else { // step === 'confirm'
          if (enteredPin === tempPin) {
            onPinSet?.(enteredPin);
          } else {
            setError('PIN-kodlar mos kelmadi. Qaytadan urining.');
            triggerShake();
            setTempPin('');
            setEnteredPin('');
            setStep('initial');
          }
        }
      }
    } else {
        setError('');
    }
  }, [enteredPin, mode, storedPin, onSuccess, onPinSet, step, tempPin]);

  const handleNumberClick = (num: string) => {
    if (enteredPin.length < PIN_LENGTH) {
      setEnteredPin(enteredPin + num);
    }
  };

  const handleBackspaceClick = () => {
    setEnteredPin(enteredPin.slice(0, -1));
  };

  const PinDots = () => (
    <div className="flex justify-center space-x-4 my-6">
      {Array.from({ length: PIN_LENGTH }).map((_, i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full transition-all duration-200 ${
            i < enteredPin.length ? 'bg-islamic-green-500' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const Keypad = () => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'];
    return (
      <div className="grid grid-cols-3 gap-4">
        {keys.map((key, index) => (
          <button
            key={index}
            onClick={() => {
              if (key === 'backspace') {
                handleBackspaceClick();
              } else if (key !== '') {
                handleNumberClick(key);
              }
            }}
            disabled={key === ''}
            className={`flex items-center justify-center h-20 rounded-full text-3xl font-light transition-colors ${
                key === '' ? 'cursor-default' : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800'
            }`}
          >
            {key === 'backspace' ? <BackspaceIcon className="w-8 h-8 text-gray-700" /> : key}
          </button>
        ))}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-xs mx-auto text-center">
        <h1 className="text-2xl font-bold text-islamic-green-800 mb-2">{getTitle()}</h1>
        <p className="text-gray-500 mb-4">Ilovani himoya qilish uchun {PIN_LENGTH} xonali koddan foydalaning.</p>
        <div className={shake ? 'animate-shake' : ''}>
            <PinDots />
        </div>
        
        {error && <p className="text-red-500 text-sm h-5 mb-4">{error}</p>}
        {!error && <div className="h-5 mb-4"></div>}
        
        <Keypad />
      </div>
       <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default PinScreen;