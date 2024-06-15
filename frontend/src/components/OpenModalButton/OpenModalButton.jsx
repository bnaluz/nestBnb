import { useModal } from '../../context/Modal';

const OpenModalButton = ({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose,
}) => {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = (e) => {
    e.stopPropagation();
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === 'function') onButtonClick(e);
  };

  return <button onClick={onClick}>{buttonText}</button>;
};

export default OpenModalButton;
