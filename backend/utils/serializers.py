"""
Shared serialization utilities for converting MongoDB documents to JSON-safe dicts.
"""
from datetime import datetime
from bson import ObjectId


def serialize_doc(doc: dict, id_alias: str = "_id") -> dict:
    """Convert MongoDB document to JSON-safe dictionary.
    
    Args:
        doc: MongoDB document to serialize
        id_alias: Field name to use for the _id value (default: "_id")
        
    Returns:
        Serialized dictionary with ObjectId and datetime converted to strings
    """
    if doc is None:
        return doc
    
    doc = dict(doc)
    
    # Convert ObjectId to string
    if "_id" in doc:
        doc[id_alias] = str(doc.pop("_id"))
    
    # Convert ObjectId and datetime fields to strings
    for key, val in doc.items():
        if isinstance(val, datetime):
            doc[key] = val.isoformat()
        elif isinstance(val, ObjectId):
            doc[key] = str(val)
    
    return doc
