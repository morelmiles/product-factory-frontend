import React from 'react';
import { Row, Spin } from 'antd';

interface IProps {

}
export const Spinner: React.SFC<IProps> = ({}) => {
    return (
        <div className='mt-100'>
            <Row justify="space-around" align="middle">
                <Spin size='large'/>
            </Row>
        </div>
    )
}

export default Spinner;
