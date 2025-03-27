import requests
import json
import logging
from config import Config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def call_openai_api(prompt, model="Pro/deepseek-ai/DeepSeek-V3", temperature=0.3):
    """
    Call OpenAI API with the given prompt and parameters.
    
    Args:
        prompt (str): The input prompt for the model
        model (str): The model to use (default: "gpt-3.5-turbo")
        temperature (float): Sampling temperature (default: 0.7)
        max_tokens (int): Maximum number of tokens to generate (default: 1000)
        use_custom_api (bool): Whether to use custom API endpoint (default: False)
    
    Returns:
        dict: The API response
    """
    try:
        # Prepare the request payload
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
        }
        
        # Determine which API endpoint to use
        api_url = Config.CUSTOM_API_URL
        
        # Make the API request
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {Config.OPENAI_API_KEY}"
        }
        
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()
        
        return response.json()
    
    except requests.exceptions.RequestException as e:
        logger.error(f"API request failed: {str(e)}")
        return {"error": str(e)}
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse API response: {str(e)}")
        return {"error": "Invalid JSON response"}
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return {"error": "An unexpected error occurred"}
    

def call_openai_api_with_prompt_list(prompt, model="Pro/deepseek-ai/DeepSeek-V3", temperature=0.3):
    """
    Call OpenAI API with the given prompt and parameters.
    
    Args:
        prompt (list): The input prompt list for the model
        model (str): The model to use (default: "gpt-3.5-turbo")
        temperature (float): Sampling temperature (default: 0.7)
        max_tokens (int): Maximum number of tokens to generate (default: 1000)
        use_custom_api (bool): Whether to use custom API endpoint (default: False)
    
    Returns:
        dict: The API response
    """
    try:
        # Prepare the request payload
        payload = {
            "model": model,
            "messages": prompt,
            "temperature": temperature,
        }
        
        # Determine which API endpoint to use
        api_url = Config.CUSTOM_API_URL
        
        # Make the API request
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {Config.OPENAI_API_KEY}"
        }
        
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()
        
        return response.json()
    
    except requests.exceptions.RequestException as e:
        logger.error(f"API request failed: {str(e)}")
        return {"error": str(e)}
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse API response: {str(e)}")
        return {"error": "Invalid JSON response"}
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return {"error": "An unexpected error occurred"}


def get_chat_response(prompt, **kwargs):
    """
    Get a chat response from OpenAI API
    
    Args:
        prompt (str): The input prompt
        **kwargs: Additional arguments to pass to call_openai_api
    
    Returns:
        str: The generated response text
    """
    response = call_openai_api(prompt, **kwargs)
    if "error" in response:
        return f"Error: {response['error']}"
    
    try:
        return response["choices"][0]["message"]["content"]
    except (KeyError, IndexError) as e:
        logger.error(f"Failed to extract response: {str(e)}")
        return "Error: Invalid response format"


def get_chat_response_with_prompt_list(prompt_list, **kwargs):
    """
    Get a chat response from OpenAI API
    
    Args:
        prompt (str): The input prompt
        **kwargs: Additional arguments to pass to call_openai_api
    
    Returns:
        str: The generated response text
    """
    response = call_openai_api_with_prompt_list(prompt_list, **kwargs)
    if "error" in response:
        return f"Error: {response['error']}"
    
    try:
        return response["choices"][0]["message"]["content"]
    except (KeyError, IndexError) as e:
        logger.error(f"Failed to extract response: {str(e)}")
        return "Error: Invalid response format"
