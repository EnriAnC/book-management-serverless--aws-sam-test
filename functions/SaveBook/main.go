package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

// Estructuras para el evento y respuesta
type Producto struct {
	ID     string  `json:"id"`
	Nombre string  `json:"nombre"`
	Precio float64 `json:"precio"`
}

// Definir cliente de DynamoDB
var dynamoClient *dynamodb.Client

func init() {
	// Cargar configuración de AWS y crear cliente de DynamoDB
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("sa-east-1")) // Ajusta la región según sea necesario
	if err != nil {
		log.Fatalf("No se pudo cargar la configuración: %v", err)
	}
	dynamoClient = dynamoClientFromConfig(cfg)
}

func dynamoClientFromConfig(cfg aws.Config) *dynamodb.Client {
	return dynamodb.NewFromConfig(cfg)
}

// Función de manejo de Lambda para crear un item en DynamoDB
func HandleRequest() (string, error) {
	tableName := os.Getenv("TABLE_NAME") // Configura el nombre de la tabla en variables de entorno

	// Crear un ítem en DynamoDB
	_, err := dynamoClient.PutItem(context.TODO(), &dynamodb.PutItemInput{
		TableName: aws.String(tableName),
		Item: map[string]types.AttributeValue{
			"ID":     &types.AttributeValueMemberS{Value: "ID"},
			"Nombre": &types.AttributeValueMemberS{Value: "Nombre"},
			"Precio": &types.AttributeValueMemberN{Value: fmt.Sprintf("%.2f", 100.0)},
		},
	})
	if err != nil {
		return "", fmt.Errorf("error al crear el producto en DynamoDB: %v", err)
	}

	return fmt.Sprintf("Producto %s creado correctamente", "Nombre"), nil
}

func main() {
	// Iniciar lambda v2
	
	HandleRequest();
}
