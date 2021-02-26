import React, {useEffect, useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {GET_TASKS} from '../../graphql/queries';
import TaskTable from '../TaskTable'
import Loading from "../Loading";


type Props = {
  setTaskNum: (value: number) => void,
  showInitiativeName?: boolean,
  showProductName?: boolean,
  sortedBy: string,
  statuses: string[],
  tags: string[],
};

const TaskTab: React.FunctionComponent<Props> = (
  {
    setTaskNum,
    sortedBy,
    statuses,
    showInitiativeName = false,
    showProductName = false,
    tags
   }
) => {
  const [userId, setUserId] = useState<string | null>(null);

  const {data, error, loading, refetch} = useQuery(GET_TASKS, {
    variables: {
      userId: userId == null ? 0 : userId,
      input: {sortedBy, statuses, tags}
    }
  });

  useEffect(() => {
    if (!error && data && data.tasks) {
      setTaskNum(data.tasks.length);
    }
  });

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  if (loading) return <Loading/>
  if (!data || !data.tasks) return <h3 className="text-center">No tasks</h3>

  return (
    <TaskTable submit={() => refetch()}
               tasks={data.tasks}
               statusList={data.statusList}
               showInitiativeName={showInitiativeName}
               showProductName={showProductName}
               hideTitle={true}/>
  );
};

export default TaskTab;