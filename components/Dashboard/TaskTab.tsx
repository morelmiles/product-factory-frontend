import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_TASKS } from "../../graphql/queries";
import TaskTableTiles from "../TaskTableTiles";
import Loading from "../Loading";
import { TASK_TYPES } from "../../graphql/types";
import FilterModal from "../FilterModal";

type Props = {
  setTaskNum: (value: number) => void;
  showInitiativeName?: boolean;
  showProductName?: boolean;
  filterModal?: boolean;
  setFilterModal: (value: boolean) => void;
};

const TaskTab: React.FunctionComponent<Props> = ({
  setTaskNum,
  showInitiativeName = false,
  showProductName = false,
  filterModal = false,
  setFilterModal,
}) => {
  const [inputData, setInputData] = useState({
    sortedBy: "priority",
    statuses: [],
    tags: [],
    priority: [],
    stacks: [],
    assignee: [],
    taskCreator: [],
  });

  const { data, error, loading, refetch } = useQuery(GET_TASKS, {
    variables: {
      input: inputData,
    },
  });

  const applyFilter = (values: any) => {
    values = Object.assign(values, {});
    setInputData(values);
    setFilterModal(false);
  };

  useEffect(() => {
    if (!error && data && data.tasklisting) {
      setTaskNum(data.tasklisting.length);
    }
  });

  if (loading) return <Loading />;
  if (!data || !data.tasklisting)
    return <h3 className="text-center">No tasks</h3>;
  const tasks = data.tasklisting;

  return (
    <>
      <TaskTableTiles
        submit={() => refetch()}
        tasks={tasks}
        statusList={TASK_TYPES}
        showInitiativeName={showInitiativeName}
        showProductName={showProductName}
        hideTitle={true}
      />
      <FilterModal
        modal={filterModal}
        initialForm={inputData}
        closeModal={() => setFilterModal(false)}
        submit={applyFilter}
      />
    </>
  );
};

export default TaskTab;
