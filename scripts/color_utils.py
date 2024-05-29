def rgb_to_hex(r, g, b):
    """
    Convert RGB values (in the range of 0 to 1) to HEX format.

    Parameters:
    r (float): Red component, between 0 and 1.
    g (float): Green component, between 0 and 1.
    b (float): Blue component, between 0 and 1.

    Returns:
    str: HEX color code.
    """
    # Ensure values are within the 0 to 1 range
    if not (0 <= r <= 1 and 0 <= g <= 1 and 0 <= b <= 1):
        raise ValueError("RGB values must be in the range of 0 to 1.")

    # Convert the RGB values to 0-255 range
    r = int(r * 255)
    g = int(g * 255)
    b = int(b * 255)

    # Convert to hexadecimal format
    hex_color = "#{:02x}{:02x}{:02x}".format(r, g, b)
    return hex_color


def hex_to_rgb(hex_color):
    """
    Convert a HEX color code to RGB values (in the range of 0 to 1).

    Parameters:
    hex_color (str): HEX color code.

    Returns:
    tuple: (r, g, b) where each component is a float between 0 and 1.
    """
    # Remove the hash symbol if present
    hex_color = hex_color.lstrip('#')

    # Convert the hex values to integers
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)

    # Convert the values to the range of 0 to 1
    r = r / 255.0
    g = g / 255.0
    b = b / 255.0

    return (r, g, b)