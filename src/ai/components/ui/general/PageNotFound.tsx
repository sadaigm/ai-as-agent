import { Result, Button } from 'antd'
import React from 'react'

const PageNotFound = () => {
    const onClick = () => {
        window.location.assign('/')
    }
  return (
    <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button onClick={onClick} type="primary">Back Home</Button>}
  />
  )
}

export default PageNotFound