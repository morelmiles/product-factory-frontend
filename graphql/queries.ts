import gql from 'graphql-tag'

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
      availableTasks {
        id
        title
        description
      }
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
      capabilitySet {
        id
        name
        availableTaskNum
        taskSet {
          id
          title
          status
        }
        children {
          id
          name
          children {
            id
            name
            children {
              id
              name
            }
          }
        }
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
      isAdmin
    }
    userRole(slug: $slug)
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
      capabilitySet {
        id
        name
        availableTaskNum
        taskSet {
          id
          title
          status
        }
        children {
          id
          name
          children {
            id
            name
            children {
              id
              name
            }
          }
        }
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
      isAdmin
    }
    userRole(slug: $slug)
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

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      detailUrl
      description
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
      taskclaimSet {
        person {
          id
          fullName
          emailAddress
          slug
        }
        kind
      }
      tag {
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
    }
    statusList
  }
`

export const GET_TASKS_BY_PRODUCT = gql`
  query GetTasks($productSlug: String) {
    tasks(productSlug: $productSlug) {
      id
      detailUrl
      description
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
      tag {
        id
        name
      }
      dependOn {
        id
        title
        status
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
    }
    statusList
  }
`

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
`

export const GET_CAPABILITY_BY_ID = gql`
  query GetCapability($id: Int!) {
    capability(id: $id) {
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
        shortDescription
        fullDescription
        tag {
          id
          name
        }
      }
      children {
        id
        name
      }
      attachment {
        id
        name
        path
        fileType
      }
      parent {
        id
        name
      }
      tasks {
        id
        detailUrl
        description
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
        taskclaimSet {
          person {
            id
            fullName
            emailAddress
            slug
          }
          kind
        }
      }
    }
  }
`

export const GET_CAPABILITY_CHILDREN = gql`
query GetChildCapabilities($capabilityId: Int, $productSlug: String) {
	childCapabilities(capabilityId: $capabilityId, productSlug: $productSlug){
    id
    name
    children {
      id
      name
      availableTaskNum
      taskSet {
        id
        status
      }
    }
    availableTaskNum
    taskSet {
      id
      status
    }
  }
}
`

export const GET_INITIATIVES = gql`
  query GetInitiatives($productSlug: String) {
    initiatives(productSlug: $productSlug) {
      id
      name
      product {
        id
        name
        website
      }
      taskSet {
        id
        status
      }
    }
  }
`

export const GET_INITIATIVE_BY_ID = gql`query GetInitiative($id: Int!) {
  initiative(id: $id) {
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
    taskSet {
      id
      title
      description
      status
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
    }
  }
}`

export const GET_TASK_BY_ID = gql`
  query GetTask($id: Int!) {
    task(id: $id) {
      id
      detailUrl
      repository
      title
      description
      shortDescription
      status
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
        breadcrumb {
          id
          name
        }
      }
      initiative {
        id
        name
      }
      tag {
        id
        name
      }
      dependOn {
        id
        title
        status
      }
    }
    statusList
  }
`

export const GET_PRODUCT_ROLES = gql`
  query GetProductRoles($productSlug: String) {
    productRoles(productSlug: $productSlug) {
      person {
        id
        fullName
        emailAddress
        photo
        slug
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
      role
    }
  }
`

export const GET_USERS = gql`
  query GetAllUser {
    people {
      id
      emailAddress
      fullName
    }
  }
`

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
      rank
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
      rank
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
      }
      initiative {
        id
        name
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
        }
        product {
          id
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
          role: productpersonSet {
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
          role: productpersonSet {
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
`