import gql from 'graphql-tag';


export const CREATE_PERSON = gql`
  mutation CreatePerson($firstName: String!, $lastName: String!, $emailAddress: String!, $password: String!, $password2: String!) {
    createPerson(personInput: {firstName: $firstName, lastName: $lastName, emailAddress: $emailAddress, password: $password, password2: $password2}) {
      status
      message
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($productInfo: ProductInput!, $userId: Int!) {
    createProduct(productInfo: $productInfo, userId: $userId) {
      status
      error
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: TaskInput!) {
    createTask(input: $input) {
      task {
        title
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($input: TaskInput!, $id: Int!) {
    updateTask(input: $input, id: $id) {
      task {
        title
      }
    }
  }
`;

export const CREATE_CODE_REPOSITORY = gql`
  mutation CreateCodeRepository($input: CodeRepositoryInput!) {
    createCodeRepository(input: $input) {
      repository {
        id
        repository
      }
    }
  }
`;

export const CREATE_CAPABILITY = gql`
  mutation CreateCapability($name: String!, $nodeId: Int, $productSlug: String, $attachments: [Int]) {
    createCapability(input: {name: $name, nodeId: $nodeId, productSlug: $productSlug, attachments: $attachments}) {
      status
      capability {
        id
        name
      }
    }
  }
`;

export const UPDATE_CAPABILITY = gql`
  mutation UpdateCapability($nodeId: Int!, $name: String, $attachments: [Int]) {
    updateCapability(nodeId: $nodeId, input: {name: $name, nodeId: $nodeId, attachments: $attachments}) {
      status
      capability {
        id
        name
      }
    }
  }
`;

export const DELETE_CAPABILITY = gql`
  mutation DeleteCapability($nodeId: Int!) {
    deleteCapability(nodeId: $nodeId) {
      status
      capabilityId
    }
  }
`;

export const CREATE_INITIATIVE = gql`
  mutation CreateInitiative($input: InitiativeInput!) {
    createInitiative(input: $input) {
      initiative {
        id
      }
    }
  }
`;

export const UPDATE_INITIATIVE = gql`
  mutation UpdateInitiative($input: InitiativeInput!, $id: Int!) {
    updateInitiative(input: $input, id: $id) {
      initiative {
        id
      }
    }
  }
`;

export const DELETE_INITIATIVE = gql`
  mutation DeleteInitiative($id: Int!) {
    deleteInitiative(id: $id) {
      initiativeId
      status
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: Int!) {
    deleteTask(id: $id) {
      taskId
      status
    }
  }
`;

export const CREATE_ATTACHMENT = gql`
  mutation CreateAttachment($input: AttachmentInput!) {
    createAttachment(input: $input) {
      attachment {
        id
        name
        path
        fileType
      }
    }
  }
`;

export const DELETE_ATTACHMENT = gql`
  mutation DeleteAttachment($id: Int!, $capabilityId: Int!) {
    deleteAttachment(id: $id, capabilityId: $capabilityId) {
      attachmentId
      status
    }
  }
`;

export const  CHANGE_TASK_PRIORITY = gql`
  mutation ChangeTaskPriority($taskId: Int!, $priority: String!) {
    changeTaskPriority(taskId: $taskId, priority: $priority) {
      status
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: uuid!) {
    delete_event(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

export const DELETE_METRICS = gql`
  mutation DeleteMetrics($id: uuid!) {
    delete_metrics(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

export const DELETE_MAP = gql`
  mutation DeleteMap($id: uuid!) {
    delete_map(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

export const ACTIVE_COUNTRY = gql`
  mutation UpdateCountry($id: uuid!, $active: Boolean!) {
    update_country(where: { id: { _eq: $id } }, _set: { active: $active }) {
      affected_rows
    }
  }
`;

export const ACTIVE_MARKET = gql`
  mutation UpdateMarket($id: uuid!, $active: Boolean!) {
    update_market(where: { id: { _eq: $id } }, _set: { active: $active }) {
      affected_rows
    }
  }
`;

export const LEAVE_TASK = gql`
  mutation LeaveTask($taskId: Int!, $userId: Int!) {
    leaveTask(taskId: $taskId, userId: $userId) {
      success,
      message
    }
  }
`;

export const CLAIM_TASK = gql`
  mutation ClaimTask($taskId: Int!, $userId: Int!) {
    claimTask(taskId: $taskId, userId: $userId) {
      success,
      message
    }
  }
`;

export const IN_REVIEW_TASK = gql`
  mutation InReviewTask($taskId: Int!, $userId: Int!) {
    inReviewTask(taskId: $taskId, userId: $userId) {
      success,
      message
    }
  }
`;