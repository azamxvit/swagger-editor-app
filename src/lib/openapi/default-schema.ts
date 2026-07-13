export const DEFAULT_SCHEMA = `openapi: 3.0.3
info:
  title: Pet Store API
  version: 1.0.0
  description: A sample API for managing pets
servers:
  - url: https://petstore.swagger.io/v2
paths:
  /pet/findByStatus:
    get:
      summary: Find pets by status
      tags:
        - pet
      parameters:
        - name: status
          in: query
          description: Status values that need to be considered for filter
          required: true
          schema:
            type: string
            enum: [available, pending, sold]
            default: available
          example: available
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
        '400':
          description: Invalid status value
  /pet:
    post:
      summary: Add a new pet
      tags:
        - pet
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - photoUrls
              properties:
                name:
                  type: string
                  example: Fluffy
                status:
                  type: string
                  enum: [available, pending, sold]
                photoUrls:
                  type: array
                  items:
                    type: string
            example:
              name: Fluffy
              photoUrls:
                - https://example.com/photo.jpg
              status: available
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                type: object
        '400':
          description: Invalid input
  /pet/{petId}:
    get:
      summary: Find pet by ID
      tags:
        - pet
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: integer
            format: int64
          example: 1
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                type: object
        '404':
          description: Pet not found
    delete:
      summary: Deletes a pet
      tags:
        - pet
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: integer
            format: int64
          example: 1
        - name: api_key
          in: header
          schema:
            type: string
          example: special-key
      responses:
        '200':
          description: Pet deleted
`;
