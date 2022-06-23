import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios'
import { v4 as uuid4 } from 'uuid'
import { Link } from 'react-router-dom'

function TaskForm() {

  const [message, setMessage] = useState('');

  const initialValues = {
    title: '',
    description: '',
    dueDate: '',
  };

  const onSubmit = (values, { resetForm }) => {

    const taskId = uuid4();
    const apiUrl = `https://my-learning-c7d79-default-rtdb.firebaseio.com/tasks/${taskId}.json`;
    const task = { ...values, status: 'New', createdDate: new Date(), id: taskId };

    axios.put(apiUrl, task).then((response) => {

      if (response.status === 200) {
        setMessage('Task has been saved')
        resetForm({ values: '' })
      }
    })
      .catch((error) => {
        setMessage('There was an error while saving data')
      });
  };

  const validate = (values) => {
    let errors = {};

    if (!values.title) {
      errors.title = 'Title cannot be empty'
    }

    if (!values.description) {
      errors.description = 'You must enter a description'
    }

    if (!values.dueDate) {
      errors.dueDate = 'Date cannot be empty'
    } else if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(values.dueDate)) {
      errors.dueDate = 'Due Date must be in dd/mm/yyyy format';
    }

    return errors;

  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate
  });

  return (
    <div className="container col-sm-8 mt-4">
      <h4 className="mb-4">New Task</h4>
      <form onSubmit={formik.handleSubmit}>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title ? <div className='small text-danger'>{formik.errors.title}</div> : null}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            rows="4"
            type="text"
            className="form-control"
            id="description"
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description ? <div className='small text-danger'>{formik.errors.description}</div> : null}
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="text"
            className="form-control"
            id="dueDate"
            name="dueDate"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.dueDate}
          />
          {formik.touched.dueDate && formik.errors.dueDate ? <div className='small text-danger'>{formik.errors.dueDate}</div> : null}
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      {message ? <div className='alert alert-primary mt-4'>{message} - Click here to see <Link to='/'>all tasks</Link></div> : null}
    </div>
  );
}

export default TaskForm;
