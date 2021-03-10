import gql from 'graphql-tag';

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      website
      shortDescription
      fullDescription
      slug
      videoUrl
      initiativeSet {
        id
      }
      tag {
        id
        name
      }
      attachment {
        name
        fileType
        path
      }
      availableTaskNum
      totalTaskNum
    }
  }
`

export const GET_PRODUCT_INFO_BY_ID = gql`
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      name
      id
      name
      website
      shortDescription
      fullDescription
      slug
      videoUrl
      initiativeSet {
        id
        name
      }
      #capabilitySet {
      #  id
      #  name
      #  availableTaskNum
      #  taskSet {
      #    id
      #    title
      #    status
      #  }
      #  children {
      #    id
      #    name
      #    children {
      #      id
      #      name
      #      children {
      #       id
      #        name
      #      }
      #    }
      #  }
      #}
      tag {
        id
        name
      }
      attachment {
        name
        fileType
        path
      }
      # isAdmin
    }
    # userPerson(slug: $slug)
    repositories(slug: $slug) {
      id
      repository
    }
    tags {
      id
      name
    }
  }
`

export const GET_PRODUCT_BY_ID = gql`
  query GetProduct($slug: String!, $userId: Int!) {
    product(slug: $slug) {
      name
      id
      name
      website
      shortDescription
      fullDescription
      slug
      videoUrl
      initiativeSet {
        id
        name
      }
      #capabilitySet {
      #  id
      #  name
      #  availableTaskNum
      #  taskSet {
      #    id
      #    title
      #    status
      #  }
      #  children {
      #    id
      #    name
      #    children {
      #      id
      #      name
      #      children {
      #        id
      #        name
      #      }
      #    }
      #  }
      #}
      tag {
        id
        name
      }
      attachment {
        name
        fileType
        path
      }
    }
    # userPerson(slug: $slug)
    repositories(slug: $slug) {
      id
      repository
    }
    tags {
      id
      name
    }
    isAdminOrManager(slug: $slug, userId: $userId)
  }
`;

export const GET_TASKS = gql`
  query GetTasks($userId: Int!, $input: TaskListInput) {
    tasks (input: $input, userId: $userId) {
      id
      publishedId
      canEdit(userId: $userId)
      priority
      detailUrl
      shortDescription
      title
      status
      initiative {
        id
        name
      }
      capability {
        id
        name
      }
      #taskclaimSet {
      #  person {
      #    id
      #    fullName
      #    emailAddress
      #    slug
      #  }
      #  kind
      #}
      tag {
        id
        name
      }
      stack {
        id
        name
      }
      dependOn {
        id
        title
        status
        dependOn {
          id
          title
          status
        }
      }
      product {
        name
        slug
      }
      assignedTo {
        id,
        fullName,
        photo,
        slug
      }
    }
  }
`;

export const GET_CAPABILITIES = gql`
  query GetCapabilities($productSlug: String) {
    capabilities(productSlug: $productSlug) {
      id
      name
      breadcrumb {
        id
        name
      }
      product {
        id
        name
        website
      }
      children {
        id
        name
      }
      taskSet {
        id
        description
        status
      }
      attachment {
        name
        path
        fileType
      }
    }
  }
`;

export const GET_CAPABILITY_BY_ID = gql`
  query GetCapability($nodeId: Int!, $slug: String!, $userId: Int!) {
    capability(nodeId: $nodeId) {
      id
      path
      depth
      name
      attachments {
        id
        name
        path
        fileType
      }
      tasks {
        id
        detailUrl
        title
        repository
        description
        shortDescription
        tag {
          id
          name
        }
      }
      product {
        name
        videoUrl,
        shortDescription,
        tag {
          id
          name
        }
      }
    }
    isAdminOrManager(slug: $slug, userId: $userId)
  }
`;


export const GET_INITIATIVES = gql`
  query GetInitiatives($productSlug: String, $stacks: [String]) {
    initiatives(productSlug: $productSlug, stacks: $stacks) {
      id
      name
      product {
        id
        name
        website
      }
      taskTags {
        id
        name
      }
      taskSet {
        id
        status
      }
      taskStacks {
        id
        name
      }
      availableTaskCount
    }
  }
`;

export const GET_INITIATIVE_BY_ID = gql`
query GetInitiative($id: Int!, $userId: Int!, $input: TaskListInput!) {
  initiative(id: $id, input: $input, userId: $userId) {
    initiative {
      id
      name
      description
      status
      product {
        id
        name
        website
        shortDescription
        fullDescription
        tag {
          id
          name
        }
      }
    }
    tasks {
      id
      publishedId
      title
      description
      status
      priority
      canEdit(userId: $userId)
      taskclaimSet {
        id
        task {
          title
        }
        person {
          id
          fullName
          emailAddress
          photo
          slug
        }
        kind
      }
      product {
        name
        slug
      }
    }
  }
}`;

export const GET_TASK_BY_ID = gql`
  query GetTask($productSlug: String!, $publishedId: Int!, $userId: Int) {
    task(productSlug: $productSlug, publishedId: $publishedId) {
      id
      reviewer {
        slug
        fullName
      }
      publishedId
      canEdit(userId: $userId)
      priority
      detailUrl
      repository
      title
      description
      shortDescription
      status
      inReview
      assignedTo {
        id
        fullName,
        photo,
        slug
      }
      attachment {
        id
        name
        fileType
        path
      }
      createdBy {
        id
        fullName
        slug
      }
      updatedBy {
        id
        fullName
        slug
      }
      taskclaimSet {
        person {
          id
          fullName
          emailAddress
          slug
        }
        kind
      }
      capability {
        id
        name
      }
      initiative {
        id
        name
      }
      tag {
        id
        name
      }
      stack {
        id
        name
      }
      dependOn {
        id
        title
        status
        publishedId
        dependOn {
          id
        }
        product {
          name
          slug
        }
        initiative {
          name
          id
        }
        assignedTo {
          id
          fullName
          slug
        }
        taskclaimSet {
          person {
            slug
            fullName
          }
        }
      }
    }
    statusList
  }
`;

export const GET_TASKS_BY_PRODUCT = gql`
  query GetTasksByProduct($productSlug: String, $reviewId: Int, $userId: Int, $input: TaskListInput) {
    tasksByProduct (productSlug: $productSlug, reviewId: $reviewId, input: $input, userId: $userId) {
      id
      publishedId
      canEdit(userId: $userId)
      title
      # description
      shortDescription
      detailUrl
      updatedAt
      product {
        name
        slug
      }
      tag {
        id
        name
      }
      stack {
        id
        name
      }
      createdAt
      status
      blocked
      featured
      priority
      initiative {
        name
        id
      }
      assignedTo {
        id,
        fullName,
        photo,
        slug
      }
    }
  }
`;

export const GET_TASKS_BY_PRODUCT_SHORT = gql`
  query GetTasksByProduct($productSlug: String, $reviewId: Int, $userId: Int, $input: TaskListInput) {
    tasksByProduct (productSlug: $productSlug, reviewId: $reviewId, input: $input) {
      id
      publishedId      
      title
      canEdit(userId: $userId)
    }
  }
`;

export const GET_PRODUCT_PERSONS = gql`
  query GetProductPerson($productSlug: String) {
    productPersons(productSlug: $productSlug) {
      person {
        id
        fullName
        emailAddress
        photo
        slug
        headline
        personsocialSet {
          id,
          name,
          url
        }
      }
      product {
        name
      }
      right
    }
  }
`

export const GET_PARTNERS = gql`
  query GetPartners($productSlug: String) {
    partners(productSlug: $productSlug) {
      company {
        name
        photo
      }
      product {
        name
      }
      person
    }
  }
`

export const GET_USERS = gql`
  query GetAllUser {
    people {
      id
      emailAddress
      fullName
      slug
    }
  }
`;

export const GET_PROFILES = gql`
  query GetProfiles {
    profile {
      person {
        id
        fullName
        emailAddress
        photo
        slug
      }
      overview
    }
  }
`

export const GET_PERSON_PROFILE = gql`
  query GetPersonProfile($personSlug: String) {
    personProfile(personSlug: $personSlug) {
      id
      person {
        id
        fullName
        emailAddress
        photo
        slug
        createdAt
        headline
        reviews: reviewSet {
          id
          product {
            id
            name
            website
            shortDescription
            fullDescription
          }
          score
          text
          createdBy {
            id
            fullName
          }
          createdAt
          updatedAt
        }
      }
      overview
      createdAt
      updatedAt
    }
  }
`;

export const GET_PERSON_SOCIALS = gql`
  query GetPersonSocials($personId: Int!) {
    personSocials(personId: $personId) {
        name
        url
      }
  }
`;

export const GET_REVIEWS = gql`
  query GetReviews($personSlug: String) {
    reviews(personSlug: $personSlug) {
      id
      person {
        id
        fullName
        emailAddress
        photo
        slug
        createdAt
      }
      product {
        id
        name
        website
        shortDescription
        fullDescription
        videoUrl
        initiativeSet {
          id
          name
        }
      }
      score
      text
      createdBy {
        id
        fullName
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_REVIEW_BY_ID = gql`
  query GetReview($reviewId: Int!, $personSlug: String) {
    review(id: $reviewId, personSlug: $personSlug) {
      review {
        person {
          id
          fullName
          emailAddress
          photo
          slug
          createdAt
          headline
        }
        product {
          id
          slug
          name
          website
          shortDescription
          fullDescription
          videoUrl
          attachment {
            name
            fileType
            path
          }
          initiatives: initiativeSet {
            id
            name
          }
        }
        score
        text
        createdBy {
          id
          fullName
        }
        createdAt
        updatedAt
      }
      productReviews {
        id
        person {
          id
          fullName
          emailAddress
          photo
          slug
          headline
          person: productpersonSet {
            right
            product {
              name
            }
          }
        }
        product {
          id
          name
          website
          shortDescription
          fullDescription
          attachment {
            name
            fileType
            path
          }
        }
        score
        text
        createdBy {
          id
          fullName
          emailAddress
          photo
          slug
          headline
          person: productpersonSet {
            right
            product {
              name
            }
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_CAPABILITIES_BY_PRODUCT = gql`
  query GetCapabilities($productSlug: String!, $userId: Int!) {
    capabilities(productSlug: $productSlug)
    isAdminOrManager(slug: $productSlug, userId: $userId)
  }
`;

export const GET_CAPABILITIES_BY_PRODUCT_AS_LIST = gql`
  query GetCapabilities($productSlug: String!) {
    capabilitiesAsList(productSlug: $productSlug) {
      id
      name
      #product {
      #  id
      #  name
      #  shortDescription
      #  videoUrl
      #}
      #tasks {
      #  id
      #  title
      #  description
      #  shortDescription
      #  status
      #}
      #attachments {
      #  id
      #  name
      #  path
      #}
    }
  }
`;

export const GET_CAPABILITY_PARENT_CRUMBS = gql`
  query GetCapabilityParentCrumbs($nodeId: Int!) {
    capabilityParentCrumbs (nodeId: $nodeId)
  }
`;

export const GET_TAGS = gql`
  query GetTags {
    tags {
      id
      name
      createdAt
    }
  }
`;

export const GET_STACKS = gql`
  query GetStacks {
    stacks {
      id
      name
    }
  }
`;

export const  GET_COMMENTS = gql`
  query GetComments($taskId: Int!) {
    comments(taskId: $taskId)
  }
`;

export const GET_PERSON = gql`
  query GetPerson($id: Int!) {
    person (id: $id) {
      id
      fullName
      slug
      productpersonSet {
        right
        product {
          name
          slug
        }
      }
    }
  }
`;

export const GET_AM_LOGIN_URL = gql`
  query GetAMLink {
    getAuthmachineLoginUrl 
  }
`;