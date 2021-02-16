import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_TASKS } from '../../graphql/queries';
import { Spinner } from '../Spinner';
import TaskTable from '../TaskTable'


type Props = {
  setTaskNum: (value: number) => void;
};

const TaskTab: React.FunctionComponent<Props> = ({ setTaskNum }) => {
  const { data, error, loading } = useQuery(GET_TASKS);

  useEffect(() => {
    if (!error && data && data.tasks) {
      setTaskNum(data.tasks.length);
    }
  });

  if(loading) return <Spinner/>
  if(!data || !data.tasks) return <h3 className="text-center">No tasks</h3>

  return (
    <TaskTable tasks={data.tasks} statusList={data.statusList} hideTitle={true} />
  );
};

export default TaskTab;