import React, { useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: '#fff', borderRadius: 8, minWidth: 320, maxWidth: 400, padding: 24, boxShadow: '0 4px 24px #0002',
        position: 'relative',
      }}>
        <button onClick={onClose} aria-label="Закрыть" style={{
          position: 'absolute', top: 10, right: 12, border: 'none', background: 'none', fontSize: 22, color: '#888', cursor: 'pointer',
        }}>&times;</button>
        {children}
      </div>
    </div>
  );
};
export const AddChannelModal = ({ open, onClose, onAdd, existingNames, loading }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const schema = yup.object().shape({
    name: yup.string()
      .trim()
      .min(3, 'От 3 символов')
      .max(20, 'До 20 символов')
      .notOneOf(existingNames, 'Канал с таким именем уже есть')
      .required('Обязательное поле'),
  });

  return (
    <Modal open={open} onClose={onClose}>
      <h3>Создать канал</h3>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await onAdd(values.name.trim());
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div style={{ marginBottom: 14 }}>
              <Field
                name="name"
                innerRef={inputRef}
                placeholder="Имя канала"
                autoComplete="off"
                style={{
                  width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc',
                  borderColor: errors.name && touched.name ? 'red' : '#ccc',
                }}
                disabled={isSubmitting || loading}
              />
              {errors.name && touched.name && (
                <div style={{ color: 'red', fontSize: 13, marginTop: 3 }}>{errors.name}</div>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              style={{ padding: '8px 22px' }}
            >
              {isSubmitting || loading ? 'Создаём...' : 'Создать'}
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
export const RenameChannelModal = ({ open, onClose, onRename, existingNames, initialName, loading }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [open]);

  const schema = yup.object().shape({
    name: yup.string()
      .trim()
      .min(3, 'От 3 символов')
      .max(20, 'До 20 символов')
      .notOneOf(existingNames, 'Канал с таким именем уже есть')
      .required('Обязательное поле'),
  });

  return (
    <Modal open={open} onClose={onClose}>
      <h3>Переименовать канал</h3>
      <Formik
        initialValues={{ name: initialName || '' }}
        validationSchema={schema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          await onRename(values.name.trim());
          setSubmitting(false);
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div style={{ marginBottom: 14 }}>
              <Field
                name="name"
                innerRef={inputRef}
                placeholder="Новое имя"
                autoComplete="off"
                style={{
                  width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc',
                  borderColor: errors.name && touched.name ? 'red' : '#ccc',
                }}
                disabled={isSubmitting || loading}
              />
              {errors.name && touched.name && (
                <div style={{ color: 'red', fontSize: 13, marginTop: 3 }}>{errors.name}</div>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              style={{ padding: '8px 22px' }}
            >
              {isSubmitting || loading ? 'Переименовываем...' : 'Переименовать'}
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
export const RemoveChannelModal = ({ open, onClose, onRemove, channelName, loading }) => (
  <Modal open={open} onClose={onClose}>
    <h3>Удалить канал</h3>
    <p>Вы уверены, что хотите удалить канал <b># {channelName}</b>? Все сообщения будут удалены. Пользователи будут перемещены в дефолтный канал.</p>
    <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
      <button
        onClick={onRemove}
        disabled={loading}
        style={{ background: '#e45', color: '#fff', padding: '8px 20px', borderRadius: 4, border: 'none' }}
      >
        {loading ? 'Удаляем...' : 'Удалить'}
      </button>
      <button
        onClick={onClose}
        disabled={loading}
        style={{ padding: '8px 20px', borderRadius: 4 }}
      >Отмена</button>
    </div>
  </Modal>
);
